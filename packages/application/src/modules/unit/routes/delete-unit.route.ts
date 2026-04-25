import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
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
 * Delete Unit Route
 */
export const deleteUnitRoute = new OpenAPIHono();

const route = createRoute({
  method: "delete",
  path: "/{id}",
  operationId: "deleteUnit",
  tags: ["unit"],

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
      description: "Unit deleted successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateUnitResponseSchema.omit({
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
      description: "User has no permission to delete unit",
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
deleteUnitRoute.openapi(route, async (c) => {
  const unitService = container.resolve(
    "unitService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");

  const result = await unitService.delete({
    context,
    where: { id },
  });

  /**
   * Only expose relevant errors
   */
  const {
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = UnitErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "unit",
    errorTrans,
  });
});
