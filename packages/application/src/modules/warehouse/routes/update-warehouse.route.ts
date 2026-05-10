import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  updateWarehouseBodySchema,
  mutateWarehouseResponseSchema,
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

import { WarehouseErrorMap } from "../errors/warehouse.error-map.js";

/**
 * Update Warehouse Route
 */
export const updateWarehouseRoute = new OpenAPIHono();

const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateWarehouse",
  tags: ["warehouse"],

  middleware: [isAuthenticatedMiddleware],

  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateWarehouseBodySchema,
        },
      },
    },
  },

  responses: {
    /**
     * Success
     */
    200: {
      description: "Warehouse updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateWarehouseResponseSchema
          ),
        },
      },
    },

    /**
     * Name conflict
     */
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Warehouse name must be unique",
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
      description: "User has no permission to update warehouse",
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
      description: "Warehouse not found",
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
updateWarehouseRoute.openapi(route, async (c) => {
  const warehouseService = container.resolve(
    "warehouseService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await warehouseService.update({
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
  } = WarehouseErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      MODULE_NAME_CONFLICT,
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "warehouse",
    errorTrans,
  });
});
