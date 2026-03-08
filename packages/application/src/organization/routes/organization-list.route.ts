import {
  AuthorizationHeaderSchema,
  createPaginatedResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  requestContextSchema,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { organizationListResponseSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";

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
    ...globalErrorResponses,
  },
});

organizationListRoute.openapi(route, async (c) => {
  const organizationService = container.resolve("organizationService");

  const lang = c.get("lang");

  const userId = c.get("user").id;
  const requestId = c.get("requestId");
  const organizationId = c.get("organizationId");
  const context = requestContextSchema.parse({
    userId,
    requestId,
    organizationId,
    lang,
  });

  const result = await organizationService.filteredPaginatedList({
    context,
  });

  const res = resultToSuccessResponse(result.data, 200);
  return c.json(res.body, 200);
});
