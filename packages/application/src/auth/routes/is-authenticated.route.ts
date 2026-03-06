import { createApi, handleResult, response } from "@avuny/hono";
import {
  createDomainErrorResponseSchema,
  createResponseSchema,
} from "@avuny/utils";
import { OpenAPIHono } from "@hono/zod-openapi";
import { userResponseTypeSchema } from "../schemas.js";
import { isAuthenticatedMiddleware } from "../middlewares/isAuthenticatedMiddleware.js";
import { getUser } from "../services/UserService.js";
import { authenticatedErrorMapping } from "../lib/auth/errors/errorsMap.js";
import { AuthenticatedErrorCodes } from "../lib/auth/errors/errors.js";

export const isAutenticatedRoute = new OpenAPIHono();
const route = createApi({
  method: "get",
  operationId: "isAuthenticated",
  path: "/is-authenticated",
  tags: ["auth"],
  responses: [
    response({
      status: 200,
      description: "User is authenticated",
      schema: createResponseSchema(userResponseTypeSchema),
    }),
    response({
      status: 401,
      description: "Token is missing or invalid, user is required to login",
      schema: createDomainErrorResponseSchema([
        AuthenticatedErrorCodes.UNAUTHENTICATED,
      ]),
    }),
  ],
});

isAutenticatedRoute.use(isAuthenticatedMiddleware);
isAutenticatedRoute.openapi(route, async (c) => {
  const user = c.get("user");

  const result = await getUser(user.id);

  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: authenticatedErrorMapping,
    moduleName: "auth",
  });
});
