import { OpenAPIHono } from "@hono/zod-openapi";
import { AuthLoginDomainErrorCodes } from "../lib/auth/errors/errors.js";
import { authLoginErrorMapping } from "../lib/auth/errors/errorsMap.js";
import { createApi, response, handleResult } from "@avuny/hono";

import { authResponseTypeSchema, localLoginInputSchema } from "../schemas.js";
import { refreshTokenCookieOpts } from "../constants.js";
import { setCookie } from "hono/cookie";

import { signIn } from "../services/UserService.js";
import {
  createResponseSchema,
  createDomainErrorResponseSchema,
} from "@avuny/utils";
import { trans } from "../../intl/Translation.js";

export const signinRoute = new OpenAPIHono();
const route = createApi({
  method: "post",
  operationId: "login",
  path: "/login",
  tags: ["auth"],
  bodySchema: localLoginInputSchema,
  responses: [
    response({
      status: 200,
      description: "Auth Response",
      schema: createResponseSchema(authResponseTypeSchema),
    }),
    response({
      status: authLoginErrorMapping.AUTH_LOGIN_INCORRECT_CREDENTIALS.statusCode,
      description: "Incorrect Credentials",
      schema: createDomainErrorResponseSchema([
        AuthLoginDomainErrorCodes.AUTH_LOGIN_INCORRECT_CREDENTIALS,
      ]),
    }),
    response({
      status: authLoginErrorMapping.AUTH_LOGIN_USER_PASSWORD_NOT_SET.statusCode,
      description: "User Password Not Set",
      schema: createDomainErrorResponseSchema([
        AuthLoginDomainErrorCodes.AUTH_LOGIN_USER_PASSWORD_NOT_SET,
      ]),
    }),
  ],
});

signinRoute.openapi(route, async (c) => {
  const lang = c.get("lang");

  const errorTrans = trans({ lang });

  const body = c.req.valid("json");
  const result = await signIn(body);
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: authLoginErrorMapping,
    onSuccess: (data) => {
      const { cookieName, ...rest } = refreshTokenCookieOpts;
      setCookie(c, cookieName, data.tokens.refreshToken, rest);
    },
    moduleName: "auth",
    errorTrans,
  });
});
