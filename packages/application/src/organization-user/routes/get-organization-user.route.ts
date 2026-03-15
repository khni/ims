import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { organizationUserSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../intl/Translation.js";

export const getOrganizationUserByIdRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getOrganizationUserById",
  tags: ["organizationUser"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "OrganizationUser retrieved successfully by ID",
      content: {
        "application/json": {
          schema: createResponseSchema(
            z.union([organizationUserSchema, z.null()]),
          ),
        },
      },
    },
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to update organizationUser",
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

getOrganizationUserByIdRoute.openapi(route, async (c) => {
  const organizationUserService = container.resolve("organizationUserService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const result = await organizationUserService.findById({
    context,
    id: c.req.param("id"),
  });
  const { USER_NO_PERMISSION } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "organizationUser",
    errorTrans,
  });
});
