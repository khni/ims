import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { onError } from "./onError.js";

import { resolveRequestLanguageMiddleware } from "@avuny/hono";
import { AuthRoutes } from "./auth/index.js";
import { OrganizationRoutes } from "./organization/routes/index.js";
import { RoleRoutes } from "./role/routes/index.js";
import { OrganizationUserRoutes } from "./organization-user/routes/index.js";
import { RegionRoutes } from "./region/routes.js";
// import { createHonoErrorHandler } from "@khni/error-handler";
// const errorHandler = createHonoErrorHandler(console);
// src/app.ts

export const app = new OpenAPIHono().basePath("/api");
app.use(resolveRequestLanguageMiddleware);
// routes here
app.route("/auth", AuthRoutes);
app.route("/organizations", OrganizationRoutes);
app.route("/organization-users", OrganizationUserRoutes);
app.route("/regions", RegionRoutes);
app.route("/roles", RoleRoutes);

app.onError(onError);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: "IMS API", version: "1.0.0" },
});

app.get("/docs", swaggerUI({ url: "/api/openapi.json" }));
