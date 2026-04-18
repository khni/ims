import { OpenAPIHono } from "@hono/zod-openapi";

import { createItemRoute } from "./create-item.route.js";
import { itemListRoute } from "./item-list.route.js";
import { updateItemRoute } from "./update-item.route.js";
import { getItemByIdRoute } from "./get-item.route.js";
import { deleteItemRoute } from "./delete-item.route.js";

/**
 * Item Routes Aggregator
 */
export const app = new OpenAPIHono();

/**
 * Register routes
 */
app.route("/", createItemRoute);
app.route("/", itemListRoute);
app.route("/", updateItemRoute);
app.route("/", getItemByIdRoute);
app.route("/", deleteItemRoute);

/**
 * Export namespaced routes
 */
export { app as ItemRoutes };
