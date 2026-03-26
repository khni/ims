import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  updateOrganizationUserBodySchema,
  mutateOrganizationUserResponseSchema,
} from "../schemas.js";
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

export const updateOrganizationUserRoute = new OpenAPIHono();
const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateOrganizationUser",
  tags: ["organizationUser"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateOrganizationUserBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "OrganizationUser have been updated successfully",
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

updateOrganizationUserRoute.openapi(route, async (c) => {
  const organizationUserService = container.resolve("organizationUserService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await organizationUserService.update({
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
    moduleName: "organizationUser",
    errorTrans,
  });
});
