import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  updateItemBodySchema,
  mutateItemResponseSchema,
} from "@avuny/shared";

import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import {
  getContext,
  handleResult,
} from "@avuny/hono";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import container from "../../../container.js";
import { trans } from "../../../intl/trans.js";

import { ItemErrorMap } from "../errors/item.error-map.js";

/**
 * Update Item Route
 */
export const updateItemRoute = new OpenAPIHono();

const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateItem",
  tags: ["item"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateItemBodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Item updated successfully",
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
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to update item",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.USER_NO_PERMISSION,
          ]),
        },
      },
    },

    /**
     * Resource not found
     */
    [ModuleErrorResponseMap.RESOURCE_NOT_FOUND.statusCode]: {
      description: "Item not found",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.RESOURCE_NOT_FOUND,
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
updateItemRoute.openapi(route, async (c) => {
  const itemService = container.resolve(
    "itemService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await itemService.update({
    data: body,
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const {
    MODULE_NAME_CONFLICT,
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = ItemErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      MODULE_NAME_CONFLICT,
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "item",
    errorTrans,
  });
});
