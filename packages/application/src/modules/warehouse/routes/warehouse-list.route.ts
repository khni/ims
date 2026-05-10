import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createFindManyQuerySchema,
  createPaginatedResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  warehouseFiltersSchema,
  warehouseListResponseSchema,
  WarehouseFilters,
  WarehouseSorting,
} from "@avuny/shared";

import { parseFindManyQuery, getContext, handleResult } from "@avuny/hono";

import container from "../../../container.js";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import { trans } from "../../../intl/trans.js";

import { FilteredPaginatedList } from "@avuny/core";

import { WarehouseErrorMap } from "../errors/warehouse.error-map.js";

/**
 * Warehouse List Route
 * - Supports filtering, sorting, pagination
 */
export const warehouseListRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/",
  operationId: "warehouseList",
  tags: ["warehouse"],

  middleware: [isAuthenticatedMiddleware, parseFindManyQuery],

  request: {
    headers: AuthorizationHeaderSchema,
    query: createFindManyQuerySchema({
      filtersSchema: warehouseFiltersSchema,
    }),
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Warehouse list retrieved successfully",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(warehouseListResponseSchema),
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
warehouseListRoute.openapi(route, async (c) => {
  const warehouseService = container.resolve("warehouseService");

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  /**
   * Parsed query (filters, sorting, pagination)
   */
  const query = c.get("findManyQuery") as FilteredPaginatedList<
    WarehouseFilters,
    WarehouseSorting
  >;

  const result = await warehouseService.filteredPaginatedList({
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
