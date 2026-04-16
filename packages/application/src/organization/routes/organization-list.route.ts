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
import { organizationListResponseSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../intl/trans.js";

export const organizationListRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/",
  operationId: "organizationList",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "User Organization List retrieved successfully.",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            organizationListResponseSchema.array(),
          ),
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

organizationListRoute.openapi(route, async (c) => {
  const organizationService = container.resolve("organizationService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const result = await organizationService.filteredPaginatedList({
    context,
  });

  const { USER_NO_PERMISSION } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: { USER_NO_PERMISSION },
    moduleName: "organization",
    errorTrans,
  });
});
