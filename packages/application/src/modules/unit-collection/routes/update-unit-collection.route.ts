import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  updateUnitCollectionBodySchema,
  mutateUnitCollectionResponseSchema,
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

import { UnitCollectionErrorMap } from "../errors/unit-collection.error-map.js";

/**
 * Update UnitCollection Route
 */
export const updateUnitCollectionRoute = new OpenAPIHono();

const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateUnitCollection",
  tags: ["unitCollection"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateUnitCollectionBodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "UnitCollection updated successfully",
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
     * Permission error
     */
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to update unitCollection",
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
      description: "UnitCollection not found",
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
updateUnitCollectionRoute.openapi(route, async (c) => {
  const unitCollectionService = container.resolve(
    "unitCollectionService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await unitCollectionService.update({
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
  } = UnitCollectionErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      MODULE_NAME_CONFLICT,
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "unitCollection",
    errorTrans,
  });
});
