import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  authResponseTypeSchema,
  LocalRegisterInputSchema,
  LocalRegisterWithTransformInputSchema,
} from "../schemas.js";
import {
  createResponseSchema,
  createDomainErrorResponseSchema,
  globalErrorResponses,
} from "@avuny/utils";

import { authSignUpErrorMapping } from "../lib/auth/errors/errorsMap.js";
import { signUp } from "../services/UserService.js";

import { AuthSignUpDomainErrorCodes } from "../lib/auth/errors/errors.js";

import { refreshTokenCookieOpts } from "../constants.js";
import { setCookie } from "hono/cookie";
import { handleResult } from "@avuny/hono";
import { trans } from "../../intl/trans.js";

export const signupRoute = new OpenAPIHono();
const successStatus = 201;
const userExistsError = authSignUpErrorMapping.AUTH_SIGN_UP_USER_EXIST;

const route = createRoute({
  method: "post",
  path: "/sign-up",
  operationId: "signUp",
  tags: ["auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LocalRegisterInputSchema,
        },
      },
    },
  },
  responses: {
    [successStatus]: {
      description: "User Signed up in successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(authResponseTypeSchema),
        },
      },
    },
    [userExistsError.statusCode]: {
      description: "User is exist with same identifier",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST,
          ]),
        },
      },
    },
    ...globalErrorResponses,
  },
});

signupRoute.openapi(route, async (c) => {
  const lang = c.get("lang");
  const errorTrans = trans({ lang });

  const body = c.req.valid("json");
  const bodyWithIndentifierType =
    LocalRegisterWithTransformInputSchema.parse(body);
  const result = await signUp(bodyWithIndentifierType);
  return handleResult({
    c,
    result,
    successStatus,
    errorMap: authSignUpErrorMapping,
    onSuccess: (data) => {
      const { cookieName, ...rest } = refreshTokenCookieOpts;
      setCookie(c, cookieName, data.tokens.refreshToken, rest);
    },
    errorTrans,
    moduleName: "auth",
  });
});
