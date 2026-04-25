import { OpenAPIHono } from "@hono/zod-openapi";

import { createUnitCollectionRoute } from "./create-unit-collection.route.js";
import { unitCollectionListRoute } from "./unit-collection-list.route.js";
import { updateUnitCollectionRoute } from "./update-unit-collection.route.js";
import { getUnitCollectionByIdRoute } from "./get-unit-collection.route.js";
import { deleteUnitCollectionRoute } from "./delete-unit-collection.route.js";

/**
 * UnitCollection Routes Aggregator
 */
export const app = new OpenAPIHono();

/**
 * Register routes
 */
app.route("/", createUnitCollectionRoute);
app.route("/", unitCollectionListRoute);
app.route("/", updateUnitCollectionRoute);
app.route("/", getUnitCollectionByIdRoute);
app.route("/", deleteUnitCollectionRoute);

/**
 * Export namespaced routes
 */
export { app as UnitCollectionRoutes };
