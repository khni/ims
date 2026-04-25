import {
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
  getUnitCollectionByIdResponseSchema,
} from "@avuny/shared";

import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

import { UnitCollectionErrorMap } from "../errors/unit-collection.error-map.js";

/**
 * Get UnitCollection By ID Route
 */
export const getUnitCollectionByIdRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getUnitCollectionById",
  tags: ["unitCollection"],

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
      description: "UnitCollection retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            getUnitCollectionByIdResponseSchema
          ),
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
getUnitCollectionByIdRoute.openapi(route, async (c) => {
  const unitCollectionService = container.resolve(
    "unitCollectionService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const id = c.req.param("id");

  const result = await unitCollectionService.findById({
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } =
    UnitCollectionErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "unitCollection",
    errorTrans,
  });
});
