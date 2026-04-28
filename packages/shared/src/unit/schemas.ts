import { z } from "@avuny/zod";

/* =========================
   Base Schema
========================= */

/**
 * Main entity schema
 * Represents full DB shape
 */
export const unitSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
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
export const baseMutateUnitSchema = unitSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Repo Schemas (DB layer)
 * - Includes organizationId
 */
export const createUnitRepoSchema = baseMutateUnitSchema;

export const updateUnitRepoSchema = baseMutateUnitSchema;

/**
 * Body Schemas (API layer)
 * - organizationId comes from auth/context
 */
export const createUnitBodySchema = createUnitRepoSchema.omit({
  organizationId: true,
});

export const updateUnitBodySchema = updateUnitRepoSchema.omit({
  organizationId: true,
});

/* =========================
   Response Schemas
========================= */

/**
 * Minimal response after mutation
 */
export const mutateUnitResponseSchema = unitSchema.pick({
  id: true,
  name: true,
});

/**
 * Single entity response
 */
export const getUnitByIdResponseSchema = unitSchema.pick({
  id: true,
  name: true,
  symbol: true,
  description: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Single option entity response
 */
export const getUnitOptionSchema = unitSchema.pick({
  id: true,
  name: true,
});

/**
 * List response
 */
export const unitListResponseSchema = getUnitByIdResponseSchema.array();

/**
 * List options response
 */
export const unitOptionsResponseSchema = z.object({
  nextCursor: z.object({ id: z.string().optional() }).nullable(),
  list: getUnitOptionSchema.array(),
});

/* =========================
   Filters
========================= */

/* =========================
   WhereUniqueInput
========================= */

/**
 * Unique identifier for fetching a single unit
 * - Matches Prisma WhereUniqueInput
 * - Usually only "id", but can be extended (email, slug, etc.)
 */
export const UnitWhereUniqueInputSchema = z.object({
  id: z.string(),
});

/**
 * UI Filters (simple)
 */
export const UnitFiltersSchema = z.object({
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
export const UnitOptionsQuerySchema = z.object({
  name: z.string().optional(),
  lastId: z.string(),
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
export const UnitRepoFiltersSchema = z.object({
  OR: z
    .array(
      z.union([
        z.object({ name: StringFilter }),
        z.object({ description: StringFilter }),
        z.object({ symbol: StringFilter }),
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
export const UnitSortingSchema = z.object({
  field: z.enum(["name", "createdAt", "updatedAt"]),
  direction: z.enum(["asc", "desc"]),
});

/**
 * Repo Sorting (DB layer)
 * - Matches Prisma orderBy
 */
export const UnitRepoSortingSchema = z.object({
  name: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
  updatedAt: z.enum(["asc", "desc"]).optional(),
});
