import { OauthProvider } from "@avuny/db";
import { createApi, response } from "@avuny/hono";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { SocialLoginParamsSchema } from "../../schemas.js";
import { socialSignIn } from "../../services/UserService.js";
import { Provider } from "../../lib/auth/social-auth/interfaces/ISocialAuthProvider.js";
import { refreshTokenCookieOpts } from "../../constants.js";
import { setCookie } from "hono/cookie";

export const socialLoginRoute = (provider: Provider) => {
  const socialRoute = new OpenAPIHono();

  const route = createRoute({
    method: "get",
    tags: ["Social Login"],
    path: `/${provider}`,
    operationId: `socialLogin${provider}`,
    request: {
      query: z.object({
        code: z.string().min(1).openapi({
          description: "OAuth authorization code",
        }),
        state: z.string().optional(),
      }),
    },
    responses: {
      302: {
        description: "Redirect to OAuth provider",
        headers: z.object({
          Location: z.string().url().openapi({
            description: "Redirect target",
            example: "https://accounts.google.com/o/oauth2/v2/auth",
          }),
        }),
      },
    },
  });

  socialRoute.openapi(route, async (c) => {
    const { code } = c.req.valid("query");
    console.log("code, ", code, provider);
    const result = await socialSignIn(code, provider);
    const { cookieName, ...rest } = refreshTokenCookieOpts;
    setCookie(c, cookieName, result.data.tokens.refreshToken, rest);
    return c.redirect(process.env.FRONTEND_SOCIAL_REDIRECT!, 302);
  });
  return socialRoute;
};
