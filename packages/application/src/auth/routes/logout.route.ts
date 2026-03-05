import { createApi, response } from "@avuny/hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "@avuny/zod";
import { logout } from "../services/UserService.js";
import { refreshTokenCookieOpts } from "../constants.js";
import { deleteCookie, getCookie } from "hono/cookie";

export const logoutRoute = new OpenAPIHono();

const route = createApi({
  method: "post",
  path: "/logout",
  operationId: "logout",
  tags: ["auth"],
  bodySchema: z.object({
    refreshToken: z.string().optional(),
  }),
  responses: [
    response({
      status: 200,
      description: "logout user by delete refresh token in the database",
      schema: z.string(),
    }),
  ],
});

logoutRoute.openapi(route, async (c) => {
  const body = c.req.valid("json");
  const { cookieName, ...rest } = refreshTokenCookieOpts;
  const refreshToken = getCookie(c, cookieName) || body.refreshToken;
  if (!refreshToken) {
    return c.json("you are already logged out", 200);
  }
  deleteCookie(c, cookieName);
  await logout(refreshToken);
  return c.json("done", 200);
});
