import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  createItemBodySchema,
  mutateItemResponseSchema,
} from "@avuny/shared";

import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import container from "../../../container.js";

import { trans } from "../../../intl/trans.js";
import { ItemErrorMap } from "../errors/item.error-map.js";

/**
 * Item Create Route
 */
export const createItemRoute = new OpenAPIHono();

const route = createRoute({
  method: "post",
  path: "/",
  operationId: "createItem",
  tags: ["item"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createItemBodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    201: {
      description: "Item created successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateItemResponseSchema
          ),
        },
      },
    },

    /**
     * Name conflict
     */
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Item name must be unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },

    /**
     * Creation limit exceeded
     */
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "Item creation limit exceeded",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED,
          ]),
        },
      },
    },
      /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to access item",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.USER_NO_PERMISSION,
          ]),
        },
      },
    },

    ...globalErrorResponses,
  },
});

/**
 * Route Handler
 */
createItemRoute.openapi(route, async (c) => {
  const itemService = container.resolve(
    "itemService"
  );

  const context = getContext(c);

  /**
   * Translation function (based on request language)
   */
  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const body = c.req.valid("json");

  const result = await itemService.create({
    data: body,
    context,
  });

  /**
   * Remove global errors handled elsewhere
   */
  const { RESOURCE_NOT_FOUND, ...filteredErrorMap } =
    ItemErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: filteredErrorMap,
    moduleName: "item",
    errorTrans,
  });
});
