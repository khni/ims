import { organizationListRoute } from "./organization-list.route.js";
import { createOrganizationRoute } from "../routes/create-organization.route.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { updateOrganizationRoute } from "./update-organization.route.js";
import { getOrganizationByIdRoute } from "./get-organization.route.js";

export const app = new OpenAPIHono();

app.route("/", createOrganizationRoute);
app.route("/", organizationListRoute);
app.route("/", updateOrganizationRoute);
app.route("/", getOrganizationByIdRoute);

export { app as OrganizationRoutes };
