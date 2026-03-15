import { OpenAPIHono } from "@hono/zod-openapi";
import { permissionsMatrixRoute } from "./permissionsMatrix.route.js";

export const app = new OpenAPIHono();

app.route("/", permissionsMatrixRoute);

export { app as PermissionRoutes };
