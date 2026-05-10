import { z } from "@avuny/zod";
import {
  // Schemas
  warehouseSchema,
  getWarehouseByIdResponseSchema,
  warehouseListResponseSchema,

  createWarehouseBodySchema,
  updateWarehouseBodySchema,

  createWarehouseRepoSchema,
  updateWarehouseRepoSchema,
  
  warehouseWhereUniqueInputSchema,
  warehouseFiltersSchema,
  warehouseRepoFiltersSchema,

  warehouseSortingSchema,
  warehouseRepoSortingSchema,

  warehouseOptionsResponseSchema,
} from "./schemas.js";

/* =========================
   Base Entity Type
========================= */

/**
 * Full entity (matches DB shape)
 */
export type Warehouse = z.infer<
  typeof warehouseSchema
>;

/* =========================
   Params
========================= */

/**
 * Route params
 */
export type GetWarehouseByIdParams = {
  warehouseId: string;
};

/* =========================
   Responses
========================= */

/**
 * Single entity response
 */
export type GetWarehouseByIdResponse = z.infer<
  typeof getWarehouseByIdResponseSchema
>;

/**
 * List response
 */
export type WarehouseListResponse = z.infer<
  typeof warehouseListResponseSchema
>;

/**
 * Options response
 */
export type WarehouseOptionsResponse = z.infer<typeof warehouseOptionsResponseSchema>;

/* =========================
   Mutations (API Layer)
========================= */

/**
 * Create request body (API)
 */
export type CreateWarehouseBody = z.infer<
  typeof createWarehouseBodySchema
>;

/**
 * Update request body (API)
 */
export type UpdateWarehouseBody = z.infer<
  typeof updateWarehouseBodySchema
>;

/* =========================
   Mutations (Repo Layer)
========================= */

/**
 * Create input (DB layer)
 */
export type CreateWarehouseRepo = z.infer<
  typeof createWarehouseRepoSchema
>;

/**
 * Update input (DB layer)
 */
export type UpdateWarehouseRepo = z.infer<
  typeof updateWarehouseRepoSchema
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
export type WarehouseWhereUniqueInput = z.infer<
  typeof warehouseWhereUniqueInputSchema
>;

/**
 * UI filters (from frontend)
 */
export type WarehouseFilters = z.infer<
  typeof warehouseFiltersSchema
>;

/**
 * Repo filters (Prisma / DB)
 */
export type WarehouseRepoFilters = z.infer<
  typeof warehouseRepoFiltersSchema
>;

/* =========================
   Sorting
========================= */

/**
 * UI sorting (table)
 */
export type WarehouseSorting = z.infer<
  typeof warehouseSortingSchema
>;

/**
 * Repo sorting (DB orderBy)
 */
export type WarehouseRepoSorting = z.infer<
  typeof warehouseRepoSortingSchema
>;

/* =========================
   Utility Types (Optional but Powerful)
========================= */

/**
 * Partial update helper (for forms)
 */
export type PartialWarehouse = Partial<Warehouse>;

/**
 * Key type (useful for tables/forms)
 */
export type WarehouseKey = keyof Warehouse;
