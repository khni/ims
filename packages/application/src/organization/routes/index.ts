import { createOrganizationRoute } from "../routes/create-organization.route.js";
import { OpenAPIHono } from "@hono/zod-openapi";

export const app = new OpenAPIHono();

app.route("/", createOrganizationRoute);

export { app as OrganizationRoutes };
