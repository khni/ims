import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  getItemByIdResponseSchema,
} from "@avuny/shared";

import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

import { ItemErrorMap } from "../errors/item.error-map.js";

/**
 * Get Item By ID Route
 */
export const getItemByIdRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getItemById",
  tags: ["item"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    params: getResourceByIdParamsSchema,
    headers: AuthorizationHeaderSchema,
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Item retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            getItemByIdResponseSchema
          ),
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
getItemByIdRoute.openapi(route, async (c) => {
  const itemService = container.resolve(
    "itemService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const id = c.req.param("id");

  const result = await itemService.findById({
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } =
    ItemErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "item",
    errorTrans,
  });
});
