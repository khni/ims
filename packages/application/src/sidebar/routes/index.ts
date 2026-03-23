import { OpenAPIHono } from "@hono/zod-openapi";
import { getSidebarRoute } from "./get-sidebar.route.js";

export const app = new OpenAPIHono();

app.route("/", getSidebarRoute);

export { app as SidebarRoutes };
