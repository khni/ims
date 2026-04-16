import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { createRoleBodySchema, mutateRoleResponseSchema } from "../schemas.js";
import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { prisma } from "@avuny/db";
import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../../shared.js";
import container from "../../../container.js";

import { trans } from "../../../intl/trans.js";

export const createRoleRoute = new OpenAPIHono();
const route = createRoute({
  method: "post",
  path: "/",
  operationId: "createRole",
  tags: ["role"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createRoleBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "Role have been created successfully",
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
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "Role creation limit has been exceeded",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to create role",
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

createRoleRoute.openapi(route, async (c) => {
  const roleService = container.resolve("roleService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });

  const body = c.req.valid("json");

  const result = await roleService.create({
    data: body,
    context,
  });
  const { RESOURCE_NOT_FOUND, ...restModuleErrorResponseMap } =
    ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: restModuleErrorResponseMap,
    moduleName: "role",
    errorTrans,
  });
});
