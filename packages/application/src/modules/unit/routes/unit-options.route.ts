import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createFindManyQuerySchema,
  createPaginatedResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  UnitFiltersSchema,
  unitListResponseSchema,
  UnitFilters,
  UnitSorting,
  unitOptionsResponseSchema,
  UnitOptionsQuerySchema,
} from "@avuny/shared";

import { parseFindManyQuery, getContext, handleResult } from "@avuny/hono";

import container from "../../../container.js";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import { trans } from "../../../intl/trans.js";

import { FilteredPaginatedList } from "@avuny/core";

import { UnitErrorMap } from "../errors/unit.error-map.js";

/**
 * Unit List Route
 * - Supports filtering, sorting, pagination
 */
export const unitOptionListRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/options",
  operationId: "unitOptions",
  tags: ["unit"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    query: UnitOptionsQuerySchema,
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Unit list retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(unitOptionsResponseSchema),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to access unit",
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
unitOptionListRoute.openapi(route, async (c) => {
  const unitService = container.resolve("unitService");

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  /**
   * Parsed query (filters, sorting, pagination)
   */
  const query = c.req.valid("query");

  const result = await unitService.getOptions({
    context,
    query,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION } = UnitErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "unit",
    errorTrans,
  });
});
