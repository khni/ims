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
  UnitCollectionFiltersSchema,
  unitCollectionListResponseSchema,
  UnitCollectionFilters,
  UnitCollectionSorting,
} from "@avuny/shared";

import { parseFindManyQuery, getContext, handleResult } from "@avuny/hono";

import container from "../../../container.js";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import { trans } from "../../../intl/trans.js";

import { FilteredPaginatedList } from "@avuny/core";

import { UnitCollectionErrorMap } from "../errors/unit-collection.error-map.js";

/**
 * UnitCollection List Route
 * - Supports filtering, sorting, pagination
 */
export const unitCollectionListRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/",
  operationId: "unitCollectionList",
  tags: ["unitCollection"],

  middleware: [isAuthenticatedMiddleware, parseFindManyQuery],

  request: {
    headers: AuthorizationHeaderSchema,
    query: createFindManyQuerySchema({
      filtersSchema: UnitCollectionFiltersSchema,
    }),
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "UnitCollection list retrieved successfully",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            unitCollectionListResponseSchema,
          ),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to access unitCollection",
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
unitCollectionListRoute.openapi(route, async (c) => {
  const unitCollectionService = container.resolve("unitCollectionService");

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  /**
   * Parsed query (filters, sorting, pagination)
   */
  const query = c.get("findManyQuery") as FilteredPaginatedList<
    UnitCollectionFilters,
    UnitCollectionSorting
  >;

  const result = await unitCollectionService.filteredPaginatedList({
    context,
    query,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION } = UnitCollectionErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "unitCollection",
    errorTrans,
  });
});
