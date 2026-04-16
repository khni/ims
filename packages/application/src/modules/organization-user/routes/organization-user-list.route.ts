import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createFindManyQuerySchema,
  createPaginatedResponseSchema,
  findManyQuerySchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  OrganizationUserFiltersSchema,
  organizationUserListResponseSchema,
} from "@avuny/shared";
import { parseFindManyQuery } from "@avuny/hono";
import container from "../../../container.js";

import { isAuthenticatedMiddleware } from "../../../shared.js";
import { getContext, handleResult } from "@avuny/hono";
import { trans } from "../../../intl/trans.js";

export const organizationUserListRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/",
  operationId: "organizationUserList",
  tags: ["organizationUser"],
  middleware: [isAuthenticatedMiddleware, parseFindManyQuery],
  request: {
    headers: AuthorizationHeaderSchema,
    query: createFindManyQuerySchema({
      filtersSchema: OrganizationUserFiltersSchema,
    }),
  },
  responses: {
    200: {
      description: "User OrganizationUser List retrieved successfully.",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            organizationUserListResponseSchema,
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

organizationUserListRoute.openapi(route, async (c) => {
  const organizationUserService = container.resolve("organizationUserService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });

  const query = c.get("findManyQuery") as any;
  console.log("Received organization user query parameters in route:", query);
  const result = await organizationUserService.filteredPaginatedList({
    context,
    query,
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
