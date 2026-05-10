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
  getWarehouseByIdResponseSchema,
} from "@avuny/shared";

import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

import { WarehouseErrorMap } from "../errors/warehouse.error-map.js";

/**
 * Get Warehouse By ID Route
 */
export const getWarehouseByIdRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getWarehouseById",
  tags: ["warehouse"],

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
      description: "Warehouse retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            getWarehouseByIdResponseSchema
          ),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to access warehouse",
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
      description: "Warehouse not found",
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
getWarehouseByIdRoute.openapi(route, async (c) => {
  const warehouseService = container.resolve(
    "warehouseService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const id = c.req.param("id");

  const result = await warehouseService.findById({
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } =
    WarehouseErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "warehouse",
    errorTrans,
  });
});
