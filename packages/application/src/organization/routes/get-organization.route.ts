import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { organizationSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../intl/trans.js";

export const getOrganizationByIdRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getOrganizationById",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    params: getResourceByIdParamsSchema,
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "Organization retrieved successfully by ID",
      content: {
        "application/json": {
          schema: createResponseSchema(organizationSchema),
        },
      },
    },
    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to view organization",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.USER_NO_PERMISSION,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.RESOURCE_NOT_FOUND.statusCode]: {
      description: "Organization is not found",
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

getOrganizationByIdRoute.openapi(route, async (c) => {
  const organizationService = container.resolve("organizationService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const result = await organizationService.findById({
    context,
    id: c.req.param("id"),
  });
  const { USER_NO_PERMISSION, RESOURCE_NOT_FOUND } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION, RESOURCE_NOT_FOUND },
    moduleName: "organization",
    errorTrans,
  });
});
