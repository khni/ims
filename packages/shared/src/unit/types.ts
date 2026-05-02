import { z } from "@avuny/zod";
import {
  // Schemas
  unitSchema,
  getUnitByIdResponseSchema,
  unitListResponseSchema,
  createUnitBodySchema,
  updateUnitBodySchema,
  createUnitRepoSchema,
  updateUnitRepoSchema,
  UnitWhereUniqueInputSchema,
  UnitFiltersSchema,
  UnitRepoFiltersSchema,
  UnitSortingSchema,
  UnitRepoSortingSchema,
  unitOptionsResponseSchema,
} from "./schemas.js";

/* =========================
   Base Entity Type
========================= */

/**
 * Full entity (matches DB shape)
 */
export type Unit = z.infer<typeof unitSchema>;

/* =========================
   Params
========================= */

/**
 * Route params
 */
export type GetUnitByIdParams = {
  unitId: string;
};

/* =========================
   Responses
========================= */

/**
 * Single entity response
 */
export type GetUnitByIdResponse = z.infer<typeof getUnitByIdResponseSchema>;

/**
 * List response
 */
export type UnitListResponse = z.infer<typeof unitListResponseSchema>;

/**
 * Options response
 */
export type UnitOptionsResponse = z.infer<typeof unitOptionsResponseSchema>;
/* =========================
   Mutations (API Layer)
========================= */

/**
 * Create request body (API)
 */
export type CreateUnitBody = z.infer<typeof createUnitBodySchema>;

/**
 * Update request body (API)
 */
export type UpdateUnitBody = z.infer<typeof updateUnitBodySchema>;

/* =========================
   Mutations (Repo Layer)
========================= */

/**
 * Create input (DB layer)
 */
export type CreateUnitRepo = z.infer<typeof createUnitRepoSchema>;

/**
 * Update input (DB layer)
 */
export type UpdateUnitRepo = z.infer<typeof updateUnitRepoSchema>;

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
export type UnitWhereUniqueInput = z.infer<typeof UnitWhereUniqueInputSchema>;

/**
 * UI filters (from frontend)
 */
export type UnitFilters = z.infer<typeof UnitFiltersSchema>;

/**
 * Repo filters (Prisma / DB)
 */
export type UnitRepoFilters = z.infer<typeof UnitRepoFiltersSchema>;

/* =========================
   Sorting
========================= */

/**
 * UI sorting (table)
 */
export type UnitSorting = z.infer<typeof UnitSortingSchema>;

/**
 * Repo sorting (DB orderBy)
 */
export type UnitRepoSorting = z.infer<typeof UnitRepoSortingSchema>;

/* =========================
   Utility Types (Optional but Powerful)
========================= */

/**
 * Partial update helper (for forms)
 */
export type PartialUnit = Partial<Unit>;

/**
 * Key type (useful for tables/forms)
 */
export type UnitKey = keyof Unit;
