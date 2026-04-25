import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  createUnitCollectionBodySchema,
  mutateUnitCollectionResponseSchema,
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
import { UnitCollectionErrorMap } from "../errors/unit-collection.error-map.js";

/**
 * UnitCollection Create Route
 */
export const createUnitCollectionRoute = new OpenAPIHono();

const route = createRoute({
  method: "post",
  path: "/",
  operationId: "createUnitCollection",
  tags: ["unitCollection"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createUnitCollectionBodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    201: {
      description: "UnitCollection created successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateUnitCollectionResponseSchema
          ),
        },
      },
    },

    /**
     * Name conflict
     */
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "UnitCollection name must be unique",
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
      description: "UnitCollection creation limit exceeded",
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
createUnitCollectionRoute.openapi(route, async (c) => {
  const unitCollectionService = container.resolve(
    "unitCollectionService"
  );

  const context = getContext(c);

  /**
   * Translation function (based on request language)
   */
  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const body = c.req.valid("json");

  const result = await unitCollectionService.create({
    data: body,
    context,
  });

  /**
   * Remove global errors handled elsewhere
   */
  const { RESOURCE_NOT_FOUND, ...filteredErrorMap } =
    UnitCollectionErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: filteredErrorMap,
    moduleName: "unitCollection",
    errorTrans,
  });
});
