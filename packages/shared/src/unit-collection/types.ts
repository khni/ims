import { z } from "@avuny/zod";
import {
  // Schemas
  unitCollectionSchema,
  getUnitCollectionByIdResponseSchema,
  unitCollectionListResponseSchema,

  createUnitCollectionBodySchema,
  updateUnitCollectionBodySchema,

  createUnitCollectionRepoSchema,
  updateUnitCollectionRepoSchema,
  
  UnitCollectionWhereUniqueInputSchema,
  UnitCollectionFiltersSchema,
  UnitCollectionRepoFiltersSchema,

  UnitCollectionSortingSchema,
  UnitCollectionRepoSortingSchema,
} from "./schemas.js";

/* =========================
   Base Entity Type
========================= */

/**
 * Full entity (matches DB shape)
 */
export type UnitCollection = z.infer<
  typeof unitCollectionSchema
>;

/* =========================
   Params
========================= */

/**
 * Route params
 */
export type GetUnitCollectionByIdParams = {
  unitCollectionId: string;
};

/* =========================
   Responses
========================= */

/**
 * Single entity response
 */
export type GetUnitCollectionByIdResponse = z.infer<
  typeof getUnitCollectionByIdResponseSchema
>;

/**
 * List response
 */
export type UnitCollectionListResponse = z.infer<
  typeof unitCollectionListResponseSchema
>;

/* =========================
   Mutations (API Layer)
========================= */

/**
 * Create request body (API)
 */
export type CreateUnitCollectionBody = z.infer<
  typeof createUnitCollectionBodySchema
>;

/**
 * Update request body (API)
 */
export type UpdateUnitCollectionBody = z.infer<
  typeof updateUnitCollectionBodySchema
>;

/* =========================
   Mutations (Repo Layer)
========================= */

/**
 * Create input (DB layer)
 */
export type CreateUnitCollectionRepo = z.infer<
  typeof createUnitCollectionRepoSchema
>;

/**
 * Update input (DB layer)
 */
export type UpdateUnitCollectionRepo = z.infer<
  typeof updateUnitCollectionRepoSchema
>;

/* =========================
   Filters
========================= */

/* =========================
   WhereUniqueInput Type
========================= */

/**
 * Unique identifier for fetching a single entity
 * - Matches Prisma WhereUniqueInput
 * - Usually contains only "id"
 * - Can be extended later (email, slug, etc.)
 */
export type UnitCollectionWhereUniqueInput = z.infer<
  typeof UnitCollectionWhereUniqueInputSchema
>;

/**
 * UI filters (from frontend)
 */
export type UnitCollectionFilters = z.infer<
  typeof UnitCollectionFiltersSchema
>;

/**
 * Repo filters (Prisma / DB)
 */
export type UnitCollectionRepoFilters = z.infer<
  typeof UnitCollectionRepoFiltersSchema
>;

/* =========================
   Sorting
========================= */

/**
 * UI sorting (table)
 */
export type UnitCollectionSorting = z.infer<
  typeof UnitCollectionSortingSchema
>;

/**
 * Repo sorting (DB orderBy)
 */
export type UnitCollectionRepoSorting = z.infer<
  typeof UnitCollectionRepoSortingSchema
>;

/* =========================
   Utility Types (Optional but Powerful)
========================= */

/**
 * Partial update helper (for forms)
 */
export type PartialUnitCollection = Partial<UnitCollection>;

/**
 * Key type (useful for tables/forms)
 */
export type UnitCollectionKey = keyof UnitCollection;
