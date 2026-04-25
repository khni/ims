import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  updateUnitBodySchema,
  mutateUnitResponseSchema,
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

import { UnitErrorMap } from "../errors/unit.error-map.js";

/**
 * Update Unit Route
 */
export const updateUnitRoute = new OpenAPIHono();

const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateUnit",
  tags: ["unit"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateUnitBodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Unit updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateUnitResponseSchema
          ),
        },
      },
    },

    /**
     * Name conflict
     */
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Unit name must be unique",
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
      description: "User has no permission to update unit",
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
updateUnitRoute.openapi(route, async (c) => {
  const unitService = container.resolve(
    "unitService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await unitService.update({
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
  } = UnitErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      MODULE_NAME_CONFLICT,
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "unit",
    errorTrans,
  });
});
