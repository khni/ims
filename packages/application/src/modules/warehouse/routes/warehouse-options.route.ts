import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  warehouseOptionsResponseSchema,
  warehouseOptionsQuerySchema,
} from "@avuny/shared";

import { getContext, handleResult } from "@avuny/hono";

import container from "../../../container.js";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import { trans } from "../../../intl/trans.js";

import { WarehouseErrorMap } from "../errors/warehouse.error-map.js";

/**
 * Warehouse List Route
 * - Supports filtering, sorting, pagination
 */
export const warehouseOptionListRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/options",
  operationId: "warehouseOptions",
  tags: ["warehouse"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    query: warehouseOptionsQuerySchema,
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Warehouse list retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(warehouseOptionsResponseSchema),
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

    ...globalErrorResponses,
  },
});

/**
 * Route Handler
 */
warehouseOptionListRoute.openapi(route, async (c) => {
  const warehouseService = container.resolve("warehouseService");

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  /**
   * Parsed query (filters, sorting, pagination)
   */
  const query = c.req.valid("query");

  const result = await warehouseService.getOptions({
    context,
    query,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION } = WarehouseErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "warehouse",
    errorTrans,
  });
});
