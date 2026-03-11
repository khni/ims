import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  updateOrganizationBodySchema,
  mutateOrganizationResponseSchema,
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

export const updateOrganizationRoute = new OpenAPIHono();
const route = createRoute({
  method: "put",
  path: "/{id}",
  operationId: "updateOrganization",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateOrganizationBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "Organization have been updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(mutateOrganizationResponseSchema),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Organization name is not unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },

    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to update organization",
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

updateOrganizationRoute.openapi(route, async (c) => {
  const organizationService = container.resolve("organizationService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await organizationService.update({
    data: body,
    context,
    id,
  });
  const { MODULE_CREATION_LIMIT_EXCEEDED, ...restModuleErrorResponseMap } =
    ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: restModuleErrorResponseMap,
    moduleName: "organization",
    errorTrans,
  });
});
