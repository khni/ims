import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
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
 * Delete UnitCollection Route
 */
export const deleteUnitCollectionRoute = new OpenAPIHono();

const route = createRoute({
  method: "delete",
  path: "/{id}",
  operationId: "deleteUnitCollection",
  tags: ["unitCollection"],

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
      description: "UnitCollection deleted successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateUnitCollectionResponseSchema.omit({
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
      description: "User has no permission to delete unitCollection",
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
deleteUnitCollectionRoute.openapi(route, async (c) => {
  const unitCollectionService = container.resolve(
    "unitCollectionService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");

  const result = await unitCollectionService.delete({
    context,
    where: { id },
  });

  /**
   * Only expose relevant errors
   */
  const {
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = UnitCollectionErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "unitCollection",
    errorTrans,
  });
});
