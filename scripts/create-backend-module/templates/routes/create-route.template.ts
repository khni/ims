export function createRouteTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: {
  featurePascal: string;
  featureCamel: string;
  kebabCase: string;
}) {
  return `import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  create${featurePascal}BodySchema,
  mutate${featurePascal}ResponseSchema,
} from "@avuny/shared";

import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import container from "../../../container.js";

import { trans } from "../../../intl/trans.js";
import { ${featurePascal}ErrorMap } from "../errors/${kebabCase}.error-map.js";

/**
 * ${featurePascal} Create Route
 */
export const create${featurePascal}Route = new OpenAPIHono();

const route = createRoute({
  method: "post",
  path: "/",
  operationId: "create${featurePascal}",
  tags: ["${featureCamel}"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: create${featurePascal}BodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    201: {
      description: "${featurePascal} created successfully",
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
     * Creation limit exceeded
     */
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "${featurePascal} creation limit exceeded",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED,
          ]),
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
create${featurePascal}Route.openapi(route, async (c) => {
  const ${featureCamel}Service = container.resolve(
    "${featureCamel}Service"
  );

  const context = getContext(c);

  /**
   * Translation function (based on request language)
   */
  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const body = c.req.valid("json");

  const result = await ${featureCamel}Service.create({
    data: body,
    context,
  });

  /**
   * Remove global errors handled elsewhere
   */
  const { RESOURCE_NOT_FOUND, ...filteredErrorMap } =
    ${featurePascal}ErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: filteredErrorMap,
    moduleName: "${featureCamel}",
    errorTrans,
  });
});
`;
}
