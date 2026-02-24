import { z } from "@hono/zod-openapi";
import {
  organizationSchema,
  createOrganizationBodySchema,
  updateOrganizationBodySchema,
  getOrganizationByIdSchema,
  getOrganizationByIdResponseSchema,
  mutateOrganizationResponseSchema,
  organizationListResponseSchema,
} from "./schemas.js";

/* =========================
   Base 127637522
========================= */

export type Organization = z.infer<typeof organizationSchema>;

/* =========================
   Request Bodies
========================= */

export type CreateOrganizationBody = z.infer<
  typeof createOrganizationBodySchema
>;

export type UpdateOrganizationBody = z.infer<
  typeof updateOrganizationBodySchema
>;

/* =========================
   Params
========================= */

export type GetOrganizationByIdParams = z.infer<
  typeof getOrganizationByIdSchema
>;

/* =========================
   Responses
========================= */

export type MutateOrganizationResponse = z.infer<
  typeof mutateOrganizationResponseSchema
>;

export type OrganizationListResponse = z.infer<
  typeof organizationListResponseSchema
>;

export type GetOrganizationByIdResponse = z.infer<
  typeof getOrganizationByIdResponseSchema
>;
