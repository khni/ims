import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  createOrganizationUserBodySchema,
  mutateOrganizationUserResponseSchema,
} from "@avuny/shared";
import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../shared.js";
import container from "../../container.js";

import { trans } from "../../intl/Translation.js";
import { OrganizationUserErrorCode } from "../errors/errorCode.js";
import { OrganizationUserErrorMap } from "../errors/errorMap.js";

export const createOrganizationUserRoute = new OpenAPIHono();
const route = createRoute({
  method: "post",
  path: "/",
  operationId: "createOrganizationUser",
  tags: ["organizationUser"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createOrganizationUserBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "OrganizationUser have been created successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(mutateOrganizationUserResponseSchema),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "OrganizationUser name is not unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "OrganizationUser creation limit has been exceeded",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to create organizationUser",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.USER_NO_PERMISSION,
          ]),
        },
      },
    },
    [OrganizationUserErrorMap.USER_NOT_FOUND.statusCode]: {
      description: "User ist not exists",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            OrganizationUserErrorCode.USER_NOT_FOUND,
          ]),
        },
      },
    },
    ...globalErrorResponses,
  },
});

createOrganizationUserRoute.openapi(route, async (c) => {
  const organizationUserService = container.resolve("organizationUserService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });

  const body = c.req.valid("json");

  const result = await organizationUserService.create({
    data: body,
    context,
  });
  const { RESOURCE_NOT_FOUND, ...restModuleErrorResponseMap } =
    OrganizationUserErrorMap;
  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: restModuleErrorResponseMap,
    moduleName: "organizationUser",
    errorTrans,
  });
});
