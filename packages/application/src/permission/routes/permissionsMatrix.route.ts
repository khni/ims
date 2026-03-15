import { prisma } from "@avuny/db";
import { createResponseSchema, resultToSuccessResponse } from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { PermissionsMatrixSchema } from "../schemas.js";

export const permissionsMatrixRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  operationId: "getPermissionsMatrix",
  path: "/permissions/matrix",

  responses: {
    200: {
      description: "Returns the permissions matrix",
      content: {
        "application/json": {
          schema: createResponseSchema(PermissionsMatrixSchema),
        },
      },
    },
  },
});

permissionsMatrixRoute.openapi(route, async (c) => {
  const actions = await prisma.action.findMany();
  const resources = await prisma.resource.findMany();
  const permissions = await prisma.permission.findMany();
  const http = resultToSuccessResponse(
    { actions, resources, permissions },
    200,
  );
  return c.json(http.body, http.status);
});
