import {
  AuthorizationHeaderSchema,
  createResponseSchema,
  globalErrorResponses,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { organizationSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext } from "@avuny/hono";

export const getOrganizationByIdRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/{id}",
  operationId: "getOrganizationById",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "Organization retrieved successfully by ID",
      content: {
        "application/json": {
          schema: createResponseSchema(z.union([organizationSchema, z.null()])),
        },
      },
    },
    ...globalErrorResponses,
  },
});

getOrganizationByIdRoute.openapi(route, async (c) => {
  const organizationService = container.resolve("organizationService");
  const context = getContext(c);

  const result = await organizationService.findById({
    context,
    id: c.req.param("id"),
  });

  const res = resultToSuccessResponse(result.data, 200);
  return c.json(res.body, 200);
});
