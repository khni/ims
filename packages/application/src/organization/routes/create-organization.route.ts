import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  createOrganizationBodySchema,
  mutateOrganizationResponseSchema,
  organizationSchema,
} from "../schemas.js";
import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  requestContextSchema,
} from "@avuny/utils";

import { prisma } from "@avuny/db";
import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../shared.js";
import container from "../../container.js";

import { trans } from "../../intl/Translation.js";

export const createOrganizationRoute = new OpenAPIHono();
const route = createRoute({
  method: "post",
  path: "/",
  operationId: "createOrganization",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createOrganizationBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "Organization have been created successfully",
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
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "Organization creation limit has been exceeded",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to create organization",
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

createOrganizationRoute.openapi(route, async (c) => {
  const organizationService = container.resolve("organizationService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });

  const body = c.req.valid("json");

  const result = await organizationService.create({
    data: body,
    context,
  });
  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: ModuleErrorResponseMap,
    moduleName: "organization",
    errorTrans,
  });
});
