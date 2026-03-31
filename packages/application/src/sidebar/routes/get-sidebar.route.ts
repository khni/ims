import { AuthorizationHeaderSchema, globalErrorResponses } from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { sidebarItemsSchema } from "../schemas.js";

import container from "../../container.js";

import { isAuthenticatedMiddleware } from "../../shared.js";
import { getContext, handleResult } from "@avuny/hono";

export const getSidebarRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/",
  operationId: "getSidebar",
  tags: ["sidebar"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "Sidebar retrieved successfully.",
      content: {
        "application/json": {
          schema: sidebarItemsSchema,
        },
      },
    },

    ...globalErrorResponses,
  },
});

getSidebarRoute.openapi(route, async (c) => {
  const sidebarService = container.resolve("sidebarService");
  const context = getContext(c);

  const result = await sidebarService.get({
    organizationId: context.organizationId,
    userId: context.userId,
    lang: context.lang,
  });

  return c.json(result, 200);
});
