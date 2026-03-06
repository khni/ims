import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute } from "./sign-up.route.js";
import { signinRoute } from "./sign-in.route.js";
import { isAutenticatedRoute } from "./is-authenticated.route.js";
import { logoutRoute } from "./logout.route.js";
import { refreshTokenRoute } from "./refresh-token.route.js";
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
