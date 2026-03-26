import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getRoleByIdResponseSchema, roleSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../intl/Translation.js";

export const getRoleByIdRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getRoleById",
  tags: ["role"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
  },
  responses: {
    200: {
      description: "Role retrieved successfully by ID",
      content: {
        "application/json": {
          schema: createResponseSchema(getRoleByIdResponseSchema),
        },
      },
    },
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to view role",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.USER_NO_PERMISSION,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.RESOURCE_NOT_FOUND.statusCode]: {
      description: "Role is not found",
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

getRoleByIdRoute.openapi(route, async (c) => {
  const roleService = container.resolve("roleService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const result = await roleService.findById({
    context,
    id: c.req.param("id"),
  });
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "role",
    errorTrans,
  });
});
