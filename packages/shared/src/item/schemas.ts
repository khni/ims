import { z } from "@avuny/zod";

/* =========================
   Base Schema
========================= */

/**
 * Main entity schema
 * Represents full DB shape
 */
export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(20),
  description: z.string().nullable(),
  organizationId: z.string(),
  purchasePrice: z.coerce.number().nonnegative(),

  salesPrice: z.coerce.number().nonnegative(),
  unit: z.string().min(2).max(20),
  returnable: z.boolean(),

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
export const baseMutateItemSchema = itemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Repo Schemas (DB layer)
 * - Includes organizationId
 */
export const createItemRepoSchema = baseMutateItemSchema;

export const updateItemRepoSchema = baseMutateItemSchema;

/**
 * Body Schemas (API layer)
 * - organizationId comes from auth/context
 */
export const createItemBodySchema = createItemRepoSchema.omit({
  organizationId: true,
});

export const updateItemBodySchema = updateItemRepoSchema.omit({
  organizationId: true,
});

/* =========================
   Response Schemas
========================= */

/**
 * Minimal response after mutation
 */
export const mutateItemResponseSchema = itemSchema.pick({
  id: true,
  name: true,
});

/**
 * Single entity response
 */
export const getItemByIdResponseSchema = itemSchema.pick({
  id: true,
  name: true,
  description: true,
  salesPrice: true,
  purchasePrice: true,
  unit: true,
  returnable: true,
  updatedAt: true,
});

/**
 * List response
 */
export const itemListResponseSchema = getItemByIdResponseSchema.array();

/* =========================
   Filters
========================= */

/* =========================
   WhereUniqueInput
========================= */

/**
 * Unique identifier for fetching a single item
 * - Matches Prisma WhereUniqueInput
 * - Usually only "id", but can be extended (email, slug, etc.)
 */
export const ItemWhereUniqueInputSchema = z.object({
  id: z.string(),
});

/**
 * UI Filters (simple)
 */
export const ItemFiltersSchema = z.object({
  name: z.string().optional(),
  updatedAt: z
    .object({
      gte: z.date(),
      lte: z.date().optional(),
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
export const ItemRepoFiltersSchema = z.object({
  OR: z
    .array(
      z.union([
        z.object({ name: StringFilter }),
        z.object({ description: StringFilter }),
      ]),
    )
    .optional(),

  organizationId: z.uuid(),

  updatedAt: z
    .object({
      gte: z.date(),
      lte: z.date().optional(),
    })
    .optional(),
  name: z.string().optional(),
});

/* =========================
   Sorting
========================= */

/**
 * UI Sorting
 * - Used in table headers
 */
export const ItemSortingSchema = z.object({
  field: z.enum(["name", "createdAt", "updatedAt"]),
  direction: z.enum(["asc", "desc"]),
});

/**
 * Repo Sorting (DB layer)
 * - Matches Prisma orderBy
 */
export const ItemRepoSortingSchema = z.object({
  name: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
  updatedAt: z.enum(["asc", "desc"]).optional(),
});
