import { Context } from "../../../types";

export function getByIdRouteTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import {
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
  get${featurePascal}ByIdResponseSchema,
} from "@avuny/shared";

import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

import { ${featurePascal}ErrorMap } from "../errors/${kebabCase}.error-map.js";

/**
 * Get ${featurePascal} By ID Route
 */
export const get${featurePascal}ByIdRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "get${featurePascal}ById",
  tags: ["${featureCamel}"],

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
      description: "${featurePascal} retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            get${featurePascal}ByIdResponseSchema
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

    /**
     * Resource not found
     */
    [ModuleErrorResponseMap.RESOURCE_NOT_FOUND.statusCode]: {
      description: "${featurePascal} not found",
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
get${featurePascal}ByIdRoute.openapi(route, async (c) => {
  const ${featureCamel}Service = container.resolve(
    "${featureCamel}Service"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const id = c.req.param("id");

  const result = await ${featureCamel}Service.findById({
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } =
    ${featurePascal}ErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "${featureCamel}",
    errorTrans,
  });
});
`;
}
