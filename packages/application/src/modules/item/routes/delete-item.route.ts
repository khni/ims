import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
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
 * Delete Item Route
 */
export const deleteItemRoute = new OpenAPIHono();

const route = createRoute({
  method: "delete",
  path: "/{id}",
  operationId: "deleteItem",
  tags: ["item"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Item deleted successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateItemResponseSchema.omit({
              name: true,
            })
          ),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to delete item",
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
deleteItemRoute.openapi(route, async (c) => {
  const itemService = container.resolve(
    "itemService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");

  const result = await itemService.delete({
    context,
    where: { id },
  });

  /**
   * Only expose relevant errors
   */
  const {
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = ItemErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "item",
    errorTrans,
  });
});
