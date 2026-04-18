import { Context } from "../../../types";

export function listRouteTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import {
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
  ${featurePascal}FiltersSchema,
  ${featureCamel}ListResponseSchema,
  ${featurePascal}Filters,
  ${featurePascal}Sorting,
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

import { ${featurePascal}ErrorMap } from "../errors/${kebabCase}.error-map.js";

/**
 * ${featurePascal} List Route
 * - Supports filtering, sorting, pagination
 */
export const ${featureCamel}ListRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/",
  operationId: "${featureCamel}List",
  tags: ["${featureCamel}"],

  middleware: [
    isAuthenticatedMiddleware,
    parseFindManyQuery,
  ],

  request: {
    headers: AuthorizationHeaderSchema,
    query: createFindManyQuerySchema({
      filtersSchema: ${featurePascal}FiltersSchema,
    }),
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "${featurePascal} list retrieved successfully",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            ${featureCamel}ListResponseSchema
          ),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to access ${featureCamel}",
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
${featureCamel}ListRoute.openapi(route, async (c) => {
  const ${featureCamel}Service = container.resolve(
    "${featureCamel}Service"
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
    await ${featureCamel}Service.filteredPaginatedList({
      context,
      query,
    });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION } = ${featurePascal}ErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "${featureCamel}",
    errorTrans,
  });
});
`;
}
