import { organizationListRoute } from "./organization-list.route.js";
import { createOrganizationRoute } from "../routes/create-organization.route.js";
import { OpenAPIHono } from "@hono/zod-openapi";

export const app = new OpenAPIHono();

app.route("/", createOrganizationRoute);
app.route("/", organizationListRoute);

export { app as OrganizationRoutes };
