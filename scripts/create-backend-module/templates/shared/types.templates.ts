import { Context } from "../../../types";

export function typesTemplate({ featurePascal, featureCamel }: Context) {
  return `import { z } from "@avuny/zod";
import {
  // Schemas
  ${featureCamel}Schema,
  get${featurePascal}ByIdResponseSchema,
  ${featureCamel}ListResponseSchema,

  create${featurePascal}BodySchema,
  update${featurePascal}BodySchema,

  create${featurePascal}RepoSchema,
  update${featurePascal}RepoSchema,
  
  ${featureCamel}WhereUniqueInputSchema,
  ${featureCamel}FiltersSchema,
  ${featureCamel}RepoFiltersSchema,

  ${featureCamel}SortingSchema,
  ${featureCamel}RepoSortingSchema,

  ${featureCamel}OptionsResponseSchema,
} from "./schemas.js";

/* =========================
   Base Entity Type
========================= */

/**
 * Full entity (matches DB shape)
 */
export type ${featurePascal} = z.infer<
  typeof ${featureCamel}Schema
>;

/* =========================
   Params
========================= */

/**
 * Route params
 */
export type Get${featurePascal}ByIdParams = {
  ${featureCamel}Id: string;
};

/* =========================
   Responses
========================= */

/**
 * Single entity response
 */
export type Get${featurePascal}ByIdResponse = z.infer<
  typeof get${featurePascal}ByIdResponseSchema
>;

/**
 * List response
 */
export type ${featurePascal}ListResponse = z.infer<
  typeof ${featureCamel}ListResponseSchema
>;

/**
 * Options response
 */
export type ${featurePascal}OptionsResponse = z.infer<typeof ${featureCamel}OptionsResponseSchema>;

/* =========================
   Mutations (API Layer)
========================= */

/**
 * Create request body (API)
 */
export type Create${featurePascal}Body = z.infer<
  typeof create${featurePascal}BodySchema
>;

/**
 * Update request body (API)
 */
export type Update${featurePascal}Body = z.infer<
  typeof update${featurePascal}BodySchema
>;

/* =========================
   Mutations (Repo Layer)
========================= */

/**
 * Create input (DB layer)
 */
export type Create${featurePascal}Repo = z.infer<
  typeof create${featurePascal}RepoSchema
>;

/**
 * Update input (DB layer)
 */
export type Update${featurePascal}Repo = z.infer<
  typeof update${featurePascal}RepoSchema
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
export type ${featurePascal}WhereUniqueInput = z.infer<
  typeof ${featureCamel}WhereUniqueInputSchema
>;

/**
 * UI filters (from frontend)
 */
export type ${featurePascal}Filters = z.infer<
  typeof ${featureCamel}FiltersSchema
>;

/**
 * Repo filters (Prisma / DB)
 */
export type ${featurePascal}RepoFilters = z.infer<
  typeof ${featureCamel}RepoFiltersSchema
>;

/* =========================
   Sorting
========================= */

/**
 * UI sorting (table)
 */
export type ${featurePascal}Sorting = z.infer<
  typeof ${featureCamel}SortingSchema
>;

/**
 * Repo sorting (DB orderBy)
 */
export type ${featurePascal}RepoSorting = z.infer<
  typeof ${featureCamel}RepoSortingSchema
>;

/* =========================
   Utility Types (Optional but Powerful)
========================= */

/**
 * Partial update helper (for forms)
 */
export type Partial${featurePascal} = Partial<${featurePascal}>;

/**
 * Key type (useful for tables/forms)
 */
export type ${featurePascal}Key = keyof ${featurePascal};
`;
}
