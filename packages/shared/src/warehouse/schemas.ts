import { z } from "@avuny/zod";

/* =========================
   Base Schema
========================= */

/**
 * Main entity schema
 * Represents full DB shape
 */
export const warehouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  organizationId: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/* =========================
   Mutation Schemas
========================= */

/**
 * Base mutate schema
 * - Removes auto-generated fields
 * - Used as base for create & update
 */
export const baseMutateWarehouseSchema = warehouseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Repo Schemas (DB layer)
 * - Includes organizationId
 */
export const createWarehouseRepoSchema = baseMutateWarehouseSchema.extend({
  bins: z
    .array(
      z.object({
        code: z.string(),
        binPosition: z.string(),
      }),
    )
    .optional(),
});

export const updateWarehouseRepoSchema = baseMutateWarehouseSchema;

/**
 * Body Schemas (API layer)
 * - organizationId comes from auth/context
 */
export const createWarehouseBodySchema = createWarehouseRepoSchema.omit({
  organizationId: true,
});

export const updateWarehouseBodySchema = updateWarehouseRepoSchema.omit({
  organizationId: true,
});

/* =========================
   Response Schemas
========================= */

/**
 * Minimal response after mutation
 */
export const mutateWarehouseResponseSchema = warehouseSchema.pick({
  id: true,
  name: true,
});

/**
 * Single option entity response
 */
export const getWarehouseOptionSchema = warehouseSchema.pick({
  id: true,
  name: true,
});

/**
 * Single entity response
 */
export const getWarehouseByIdResponseSchema = warehouseSchema.pick({
  id: true,
  name: true,
  updatedAt: true,
  description: true,
});

/**
 * List response
 */
export const warehouseListResponseSchema =
  getWarehouseByIdResponseSchema.array();

/**
 * List options response
 */
export const warehouseOptionsResponseSchema = z.object({
  nextCursor: z.object({ id: z.string().optional() }).nullable(),
  list: getWarehouseOptionSchema.array(),
});

/* =========================
   Filters
========================= */

/* =========================
   WhereUniqueInput
========================= */

/**
 * Unique identifier for fetching a single warehouse
 * - Matches Prisma WhereUniqueInput
 * - Usually only "id", but can be extended (email, slug, etc.)
 */
export const warehouseWhereUniqueInputSchema = z.object({
  id: z.string(),
});

/**
 * UI Filters (simple)
 */
export const warehouseFiltersSchema = z.object({
  name: z.string().optional(),
  updatedAt: z
    .object({
      gte: z.date(),
      lte: z.date().optional(),
    })
    .optional(),
});

/**
 * UI Filters (simple)
 */
export const warehouseOptionsQuerySchema = z.object({
  name: z.string().optional(),
  cursor: z
    .object({
      id: z.string(),
    })
    .optional(),
});

/**
 * Shared string filter (Prisma-like)
 */
const StringFilter = z.object({
  contains: z.string(),
  mode: z.enum(["default", "insensitive"]).optional(),
});

/**
 * OR filter (UI → backend transformation)
 */
const OrFilterSchema = z.object({
  OR: z.array(
    z.union([
      z.object({ name: StringFilter }),
      z.object({ description: StringFilter }),
    ]),
  ),
});

/**
 * Repo Filters (DB layer)
 * - Matches Prisma where input
 */
export const warehouseRepoFiltersSchema = z.object({
  OR: z
    .array(
      z.union([
        z.object({ name: StringFilter }),
        z.object({ description: StringFilter }),
      ]),
    )
    .optional(),

  organizationId: z.uuid(),

  name: z.string().optional(),

  updatedAt: z
    .object({
      gte: z.date(),
      lte: z.date().optional(),
    })
    .optional(),
});

/* =========================
   Sorting
========================= */

/**
 * UI Sorting
 * - Used in table headers
 */
export const warehouseSortingSchema = z.object({
  field: z.enum(["name", "createdAt", "updatedAt"]),
  direction: z.enum(["asc", "desc"]),
});

/**
 * Repo Sorting (DB layer)
 * - Matches Prisma orderBy
 */
export const warehouseRepoSortingSchema = z.object({
  name: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
  updatedAt: z.enum(["asc", "desc"]).optional(),
});
