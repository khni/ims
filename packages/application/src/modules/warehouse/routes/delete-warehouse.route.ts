import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
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
 * Delete Warehouse Route
 */
export const deleteWarehouseRoute = new OpenAPIHono();

const route = createRoute({
  method: "delete",
  path: "/{id}",
  operationId: "deleteWarehouse",
  tags: ["warehouse"],

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
      description: "Warehouse deleted successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateWarehouseResponseSchema.omit({
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
      description: "User has no permission to delete warehouse",
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
deleteWarehouseRoute.openapi(route, async (c) => {
  const warehouseService = container.resolve(
    "warehouseService"
  );

  const context = getContext(c);

  const errorTrans = trans({
    lang: context.lang as "en" | "ar",
  });

  const { id } = c.req.valid("param");

  const result = await warehouseService.delete({
    context,
    where: { id },
  });

  /**
   * Only expose relevant errors
   */
  const {
    USER_NO_PERMISSION,
    RESOURCE_NOT_FOUND,
  } = WarehouseErrorMap;

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      USER_NO_PERMISSION,
      RESOURCE_NOT_FOUND,
    },
    moduleName: "warehouse",
    errorTrans,
  });
});
