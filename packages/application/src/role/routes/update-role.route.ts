import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { updateRoleBodySchema, mutateRoleResponseSchema } from "../schemas.js";
import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { prisma } from "@avuny/db";
import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../shared.js";
import container from "../../container.js";

import { trans } from "../../intl/Translation.js";

export const updateRoleRoute = new OpenAPIHono();
const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateRole",
  tags: ["role"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateRoleBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "Role have been updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(mutateRoleResponseSchema),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Role name is not unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },

    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to update role",
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

updateRoleRoute.openapi(route, async (c) => {
  const roleService = container.resolve("roleService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await roleService.update({
    data: body,
    context,
    id,
  });
  const {
    MODULE_CREATION_LIMIT_EXCEEDED,
    RESOURCE_NOT_FOUND,
    ...restModuleErrorResponseMap
  } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: restModuleErrorResponseMap,
    moduleName: "role",
    errorTrans,
  });
});
