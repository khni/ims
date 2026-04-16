import { prisma } from "@avuny/db";
import { createResponseSchema, resultToSuccessResponse } from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { PermissionsMatrixSchema } from "../schemas.js";
import { getContext } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../shared.js";
import { trans } from "../../intl/trans.js";

export const permissionsMatrixRoute = new OpenAPIHono();

const route = createRoute({
  method: "get",
  operationId: "getPermissionsMatrix",
  path: "/permissions/matrix",
  middleware: [isAuthenticatedMiddleware],
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
  const context = getContext(c);
  const t = trans({ lang: context.lang as "en" | "ar" });

  const actions = (await prisma.action.findMany()).map((act) => ({
    ...act,
    label: t(`permission:actions.${act.name}`),
  }));
  const resources = (await prisma.resource.findMany()).map((res) => ({
    ...res,
    label: t(`permission:resources.${res.name}`),
  }));
  const permissions = await prisma.permission.findMany();
  const http = resultToSuccessResponse(
    { actions, resources, permissions },
    200,
  );
  return c.json(http.body, http.status);
});
