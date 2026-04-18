import { Context } from "../../../types";

export function updateRouteTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  update${featurePascal}BodySchema,
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
 * Update ${featurePascal} Route
 */
export const update${featurePascal}Route = new OpenAPIHono();

const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "update${featurePascal}",
  tags: ["${featureCamel}"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: update${featurePascal}BodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "${featurePascal} updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutate${featurePascal}ResponseSchema
          ),
        },
      },
    },

    /**
     * Name conflict
     */
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "${featurePascal} name must be unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },

    /**
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to update ${featureCamel}",
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
update${featurePascal}Route.openapi(route, async (c) => {
  const ${featureCamel}Service = container.resolve(
    "${featureCamel}Service"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await ${featureCamel}Service.update({
    data: body,
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const {
    MODULE_NAME_CONFLICT,
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = ${featurePascal}ErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      MODULE_NAME_CONFLICT,
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "${featureCamel}",
    errorTrans,
  });
});
`;
}
