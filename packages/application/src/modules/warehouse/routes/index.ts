import { OpenAPIHono } from "@hono/zod-openapi";

import { createWarehouseRoute } from "./create-warehouse.route.js";
import { warehouseListRoute } from "./warehouse-list.route.js";
import { updateWarehouseRoute } from "./update-warehouse.route.js";
import { getWarehouseByIdRoute } from "./get-warehouse.route.js";
import { deleteWarehouseRoute } from "./delete-warehouse.route.js";
import { warehouseOptionListRoute } from "./warehouse-options.route.js";

/**
 * Warehouse Routes Aggregator
 */
export const app = new OpenAPIHono();

/**
 * Register routes
 */
app.route("/", createWarehouseRoute);
app.route("/", warehouseListRoute);
app.route("/", updateWarehouseRoute);
app.route("/", warehouseOptionListRoute);
app.route("/", getWarehouseByIdRoute);
app.route("/", deleteWarehouseRoute);

/**
 * Export namespaced routes
 */
export { app as WarehouseRoutes };
