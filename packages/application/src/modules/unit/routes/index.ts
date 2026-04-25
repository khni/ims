import { OpenAPIHono } from "@hono/zod-openapi";

import { createUnitRoute } from "./create-unit.route.js";
import { unitListRoute } from "./unit-list.route.js";
import { updateUnitRoute } from "./update-unit.route.js";
import { getUnitByIdRoute } from "./get-unit.route.js";
import { deleteUnitRoute } from "./delete-unit.route.js";

/**
 * Unit Routes Aggregator
 */
export const app = new OpenAPIHono();

/**
 * Register routes
 */
app.route("/", createUnitRoute);
app.route("/", unitListRoute);
app.route("/", updateUnitRoute);
app.route("/", getUnitByIdRoute);
app.route("/", deleteUnitRoute);

/**
 * Export namespaced routes
 */
export { app as UnitRoutes };
