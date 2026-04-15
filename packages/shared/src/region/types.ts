import { z } from "@avuny/zod";
import {
  // Schemas
  regionSchema,
  getRegionByIdResponseSchema,
  regionListResponseSchema,

  createRegionBodySchema,
  updateRegionBodySchema,

  createRegionRepoSchema,
  updateRegionRepoSchema,
  
  RegionWhereUniqueInputSchema,
  RegionFiltersSchema,
  RegionRepoFiltersSchema,

  RegionSortingSchema,
  RegionRepoSortingSchema,
} from "./schemas.js";

/* =========================
   Base Entity Type
========================= */

/**
 * Full entity (matches DB shape)
 */
export type Region = z.infer<
  typeof regionSchema
>;

/* =========================
   Params
========================= */

/**
 * Route params
 */
export type GetRegionByIdParams = {
  regionId: string;
};

/* =========================
   Responses
========================= */

/**
 * Single entity response
 */
export type GetRegionByIdResponse = z.infer<
  typeof getRegionByIdResponseSchema
>;

/**
 * List response
 */
export type RegionListResponse = z.infer<
  typeof regionListResponseSchema
>;

/* =========================
   Mutations (API Layer)
========================= */

/**
 * Create request body (API)
 */
export type CreateRegionBody = z.infer<
  typeof createRegionBodySchema
>;

/**
 * Update request body (API)
 */
export type UpdateRegionBody = z.infer<
  typeof updateRegionBodySchema
>;

/* =========================
   Mutations (Repo Layer)
========================= */

/**
 * Create input (DB layer)
 */
export type CreateRegionRepo = z.infer<
  typeof createRegionRepoSchema
>;

/**
 * Update input (DB layer)
 */
export type UpdateRegionRepo = z.infer<
  typeof updateRegionRepoSchema
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
export type RegionWhereUniqueInput = z.infer<
  typeof RegionWhereUniqueInputSchema
>;

/**
 * UI filters (from frontend)
 */
export type RegionFilters = z.infer<
  typeof RegionFiltersSchema
>;

/**
 * Repo filters (Prisma / DB)
 */
export type RegionRepoFilters = z.infer<
  typeof RegionRepoFiltersSchema
>;

/* =========================
   Sorting
========================= */

/**
 * UI sorting (table)
 */
export type RegionSorting = z.infer<
  typeof RegionSortingSchema
>;

/**
 * Repo sorting (DB orderBy)
 */
export type RegionRepoSorting = z.infer<
  typeof RegionRepoSortingSchema
>;

/* =========================
   Utility Types (Optional but Powerful)
========================= */

/**
 * Partial update helper (for forms)
 */
export type PartialRegion = Partial<Region>;

/**
 * Key type (useful for tables/forms)
 */
export type RegionKey = keyof Region;
