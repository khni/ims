import { Context } from "../../../types";

export function deleteRouteTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  mutate${featurePascal}ResponseSchema,
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

import { ${featurePascal}ErrorMap } from "../errors/${kebabCase}.error-map.js";

/**
 * Delete ${featurePascal} Route
 */
export const delete${featurePascal}Route = new OpenAPIHono();

const route = createRoute({
  method: "delete",
  path: "/{id}",
  operationId: "delete${featurePascal}",
  tags: ["${featureCamel}"],

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
      description: "${featurePascal} deleted successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutate${featurePascal}ResponseSchema.omit({
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
      description: "User has no permission to delete ${featureCamel}",
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
delete${featurePascal}Route.openapi(route, async (c) => {
  const ${featureCamel}Service = container.resolve(
    "${featureCamel}Service"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");

  const result = await ${featureCamel}Service.delete({
    context,
    where: { id },
  });

  /**
   * Only expose relevant errors
   */
  const {
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = ${featurePascal}ErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "${featureCamel}",
    errorTrans,
  });
});
`;
}
