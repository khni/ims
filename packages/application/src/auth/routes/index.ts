import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute } from "./signUp.route.js";
import { signinRoute } from "./signIn.route.js";
import { isAutenticatedRoute } from "./isAuthenticated.route.js";
import { logoutRoute } from "./logout.route.js";
import { refreshTokenRoute } from "./refreshToken.route.js";
import { socialLoginRoute } from "./utils/socialLoginRoute.js";

export const app = new OpenAPIHono();

app.route("/", signinRoute);
app.route("/", signupRoute);

app.route("/", logoutRoute);
app.route("/", refreshTokenRoute);
app.route("/", socialLoginRoute("google"));
app.route("/", socialLoginRoute("facebook"));

app.route("/", isAutenticatedRoute);
export { app as AuthRoutes };
