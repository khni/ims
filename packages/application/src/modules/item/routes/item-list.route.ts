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
  ItemFiltersSchema,
  itemListResponseSchema,
  ItemFilters,
  ItemSorting,
} from "@avuny/shared";

import {
  parseFindManyQuery,
  getContext,
  handleResult,
} from "@avuny/hono";

import container from "../../../container.js";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import { trans } from "../../../intl/trans.js";


import { FilteredPaginatedList } from "@avuny/core";

import { ItemErrorMap } from "../errors/item.error-map.js";

/**
 * Item List Route
 * - Supports filtering, sorting, pagination
 */
export const itemListRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/",
  operationId: "itemList",
  tags: ["item"],

  middleware: [
    isAuthenticatedMiddleware,
    parseFindManyQuery,
  ],

  request: {
    headers: AuthorizationHeaderSchema,
    query: createFindManyQuerySchema({
      filtersSchema: ItemFiltersSchema,
    }),
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Item list retrieved successfully",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            itemListResponseSchema
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

    ...globalErrorResponses,
  },
});

/**
 * Route Handler
 */
itemListRoute.openapi(route, async (c) => {
  const itemService = container.resolve(
    "itemService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  /**
   * Parsed query (filters, sorting, pagination)
   */
  const query = c.get("findManyQuery") as FilteredPaginatedList<
      ItemFilters,
      ItemSorting
    >;

  const result =
    await itemService.filteredPaginatedList({
      context,
      query,
    });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION } = ItemErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "item",
    errorTrans,
  });
});
