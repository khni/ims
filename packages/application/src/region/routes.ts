// routes/region.routes.ts
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { RegionQueryService } from "./RegionService.js";
import { prisma } from "@avuny/db";
import { ItemResponseSchema, StateQuerySchema } from "./schemas.js";
import { globalErrorResponses } from "@avuny/utils";

const service = new RegionQueryService(prisma);

export const routes = new OpenAPIHono();

/**
 * GET /countries
 */
routes.openapi(
  createRoute({
    method: "get",
    path: "/countries",
    operationId: "countryList",
    tags: ["Regions"],
    responses: {
      200: {
        description: "List of countries",
        content: {
          "application/json": {
            schema: ItemResponseSchema.array(),
          },
        },
      },
    },
  }),
  async (c) => {
    const countries = await service.countryList();
    return c.json(countries);
  },
);

/**
 * GET /states
 */
routes.openapi(
  createRoute({
    method: "get",
    path: "/states",
    operationId: "stateList",
    tags: ["Regions"],
    request: {
      query: StateQuerySchema,
    },
    responses: {
      200: {
        description: "List of states",
        content: {
          "application/json": {
            schema: ItemResponseSchema.array(),
          },
        },
      },
      400: {
        description: "Invalid query",
      },
      ...globalErrorResponses,
    },
  }),
  async (c) => {
    const { countryId } = c.req.valid("query");
    const states = await service.stateList(countryId);
    return c.json(states);
  },
);

export { routes as RegionRoutes };
