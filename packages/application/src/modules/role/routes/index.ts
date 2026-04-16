import { roleListRoute } from "./role-list.route.js";
import { createRoleRoute } from "./create-role.route.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { updateRoleRoute } from "./update-role.route.js";
import { getRoleByIdRoute } from "./get-role.route.js";

export const app = new OpenAPIHono();

app.route("/", createRoleRoute);
app.route("/", roleListRoute);
app.route("/", updateRoleRoute);
app.route("/", getRoleByIdRoute);

export { app as RoleRoutes };
