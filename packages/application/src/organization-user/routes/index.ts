import { organizationUserListRoute } from "./organization-user-list.route.js";
import { createOrganizationUserRoute } from "./create-organization-user.route.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { updateOrganizationUserRoute } from "./update-organization-user.route.js";
import { getOrganizationUserByIdRoute } from "./get-organization-user.route.js";

export const app = new OpenAPIHono();

app.route("/", createOrganizationUserRoute);
app.route("/", organizationUserListRoute);
app.route("/", updateOrganizationUserRoute);
app.route("/", getOrganizationUserByIdRoute);

export { app as OrganizationUserRoutes };
