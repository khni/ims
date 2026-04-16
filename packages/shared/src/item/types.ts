import { z } from "@avuny/zod";
import {
  // Schemas
  itemSchema,
  getItemByIdResponseSchema,
  itemListResponseSchema,

  createItemBodySchema,
  updateItemBodySchema,

  createItemRepoSchema,
  updateItemRepoSchema,
  
  ItemWhereUniqueInputSchema,
  ItemFiltersSchema,
  ItemRepoFiltersSchema,

  ItemSortingSchema,
  ItemRepoSortingSchema,
} from "./schemas.js";

/* =========================
   Base Entity Type
========================= */

/**
 * Full entity (matches DB shape)
 */
export type Item = z.infer<
  typeof itemSchema
>;

/* =========================
   Params
========================= */

/**
 * Route params
 */
export type GetItemByIdParams = {
  itemId: string;
};

/* =========================
   Responses
========================= */

/**
 * Single entity response
 */
export type GetItemByIdResponse = z.infer<
  typeof getItemByIdResponseSchema
>;

/**
 * List response
 */
export type ItemListResponse = z.infer<
  typeof itemListResponseSchema
>;

/* =========================
   Mutations (API Layer)
========================= */

/**
 * Create request body (API)
 */
export type CreateItemBody = z.infer<
  typeof createItemBodySchema
>;

/**
 * Update request body (API)
 */
export type UpdateItemBody = z.infer<
  typeof updateItemBodySchema
>;

/* =========================
   Mutations (Repo Layer)
========================= */

/**
 * Create input (DB layer)
 */
export type CreateItemRepo = z.infer<
  typeof createItemRepoSchema
>;

/**
 * Update input (DB layer)
 */
export type UpdateItemRepo = z.infer<
  typeof updateItemRepoSchema
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
export type ItemWhereUniqueInput = z.infer<
  typeof ItemWhereUniqueInputSchema
>;

/**
 * UI filters (from frontend)
 */
export type ItemFilters = z.infer<
  typeof ItemFiltersSchema
>;

/**
 * Repo filters (Prisma / DB)
 */
export type ItemRepoFilters = z.infer<
  typeof ItemRepoFiltersSchema
>;

/* =========================
   Sorting
========================= */

/**
 * UI sorting (table)
 */
export type ItemSorting = z.infer<
  typeof ItemSortingSchema
>;

/**
 * Repo sorting (DB orderBy)
 */
export type ItemRepoSorting = z.infer<
  typeof ItemRepoSortingSchema
>;

/* =========================
   Utility Types (Optional but Powerful)
========================= */

/**
 * Partial update helper (for forms)
 */
export type PartialItem = Partial<Item>;

/**
 * Key type (useful for tables/forms)
 */
export type ItemKey = keyof Item;
