import { Context } from "../../../types";

export function optionsRouteTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  ${featureCamel}OptionsResponseSchema,
  ${featureCamel}OptionsQuerySchema,
} from "@avuny/shared";

import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

import { ${featurePascal}ErrorMap } from "../errors/${kebabCase}.error-map.js";

/**
 * ${featurePascal} Options Route
 * - Lightweight list for select dropdowns
 */
export const ${featureCamel}OptionListRoute =
  new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/options",
  operationId: "${featureCamel}Options",
  tags: ["${featureCamel}"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    query: ${featureCamel}OptionsQuerySchema,
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "${featurePascal} options retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            ${featureCamel}OptionsResponseSchema
          ),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]:
      {
        description:
          "User has no permission to access ${featureCamel}",
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
${featureCamel}OptionListRoute.openapi(
  route,
  async (c) => {
    const ${featureCamel}Service = container.resolve(
      "${featureCamel}Service"
    );

    const context = getContext(c);

    const errorTrans = trans({
      lang: context.lang as "en" | "ar",
    });

    /**
     * Parsed query
     */
    const query = c.req.valid("query");

    const result =
      await ${featureCamel}Service.getOptions({
        context,
        query,
      });

    /**
     * Only expose relevant errors
     */
    const { USER_NO_PERMISSION } =
      ${featurePascal}ErrorMap;

    return handleResult({
      c,
      result,
      successStatus: 200,
      errorMap: {
        USER_NO_PERMISSION,
      },
      moduleName: "${featureCamel}",
      errorTrans,
    });
  }
);
`;
}
