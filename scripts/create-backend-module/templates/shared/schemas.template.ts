import { Context } from "../../../types";

export function schemasTemplate({ featurePascal, featureCamel }: Context) {
  return `import { z } from "@avuny/zod";

/* =========================
   Base Schema
========================= */

/**
 * Main entity schema
 * Represents full DB shape
 */
export const ${featureCamel}Schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
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
export const baseMutate${featurePascal}Schema = ${featureCamel}Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Repo Schemas (DB layer)
 * - Includes organizationId
 */
export const create${featurePascal}RepoSchema =
  baseMutate${featurePascal}Schema;

export const update${featurePascal}RepoSchema =
  baseMutate${featurePascal}Schema;

/**
 * Body Schemas (API layer)
 * - organizationId comes from auth/context
 */
export const create${featurePascal}BodySchema =
  create${featurePascal}RepoSchema.omit({
    organizationId: true,
  });

export const update${featurePascal}BodySchema =
  update${featurePascal}RepoSchema.omit({
    organizationId: true,
  });

/* =========================
   Response Schemas
========================= */

/**
 * Minimal response after mutation
 */
export const mutate${featurePascal}ResponseSchema =
  ${featureCamel}Schema.pick({
    id: true,
    name: true,
  });

/**
 * Single entity response
 */
export const get${featurePascal}ByIdResponseSchema =
  ${featureCamel}Schema.pick({
    id: true,
    name: true,
    updatedAt: true,
  });

/**
 * List response
 */
export const ${featureCamel}ListResponseSchema =
  get${featurePascal}ByIdResponseSchema.array();

/* =========================
   Filters
========================= */

/* =========================
   WhereUniqueInput
========================= */

/**
 * Unique identifier for fetching a single ${featureCamel}
 * - Matches Prisma WhereUniqueInput
 * - Usually only "id", but can be extended (email, slug, etc.)
 */
export const ${featurePascal}WhereUniqueInputSchema = z.object({
  id: z.string(),
});

/**
 * UI Filters (simple)
 */
export const ${featurePascal}FiltersSchema = z.object({
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
export const ${featurePascal}RepoFiltersSchema = z.object({
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
export const ${featurePascal}SortingSchema = z.object({
  field: z.enum(["name", "createdAt", "updatedAt"]),
  direction: z.enum(["asc", "desc"]),
});

/**
 * Repo Sorting (DB layer)
 * - Matches Prisma orderBy
 */
export const ${featurePascal}RepoSortingSchema = z.object({
  name: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
  updatedAt: z.enum(["asc", "desc"]).optional(),
});
`;
}
