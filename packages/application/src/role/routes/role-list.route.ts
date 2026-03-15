import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createPaginatedResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { roleListResponseSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../intl/Translation.js";

export const roleListRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/",
  operationId: "roleList",
  tags: ["role"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "User Role List retrieved successfully.",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(roleListResponseSchema),
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

roleListRoute.openapi(route, async (c) => {
  const roleService = container.resolve("roleService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const result = await roleService.filteredPaginatedList({
    context,
  });

  const { USER_NO_PERMISSION } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "role",
    errorTrans,
  });
});
