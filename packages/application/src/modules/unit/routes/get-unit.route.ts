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
  getUnitByIdResponseSchema,
} from "@avuny/shared";

import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

import { UnitErrorMap } from "../errors/unit.error-map.js";

/**
 * Get Unit By ID Route
 */
export const getUnitByIdRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getUnitById",
  tags: ["unit"],

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
      description: "Unit retrieved successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            getUnitByIdResponseSchema
          ),
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

    /**
     * Resource not found
     */
    [ModuleErrorResponseMap.RESOURCE_NOT_FOUND.statusCode]: {
      description: "Unit not found",
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
getUnitByIdRoute.openapi(route, async (c) => {
  const unitService = container.resolve(
    "unitService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const id = c.req.param("id");

  const result = await unitService.findById({
    context,
    id,
  });

  /**
   * Only expose relevant errors
   */
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } =
    UnitErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "unit",
    errorTrans,
  });
});
