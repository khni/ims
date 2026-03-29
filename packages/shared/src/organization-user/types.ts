import { z } from "@hono/zod-openapi";
import {
  organizationUserSchema,
  createOrganizationUserBodySchema,
  updateOrganizationUserBodySchema,
  getOrganizationUserByIdSchema,
  getOrganizationUserByIdResponseSchema,
  mutateOrganizationUserResponseSchema,
  organizationUserListResponseSchema,
  mutateOrganizationUserSchema,
  createOrganizationUserRepositorySchema,
} from "./schemas.js";

/* =========================
   Base 
========================= */

export type OrganizationUser = z.infer<typeof organizationUserSchema>;

/* =========================
   Request Bodies
========================= */
export type MutateOrganizationUserBody = z.infer<
  typeof mutateOrganizationUserSchema
>;

export type CreateOrganizationUserRepository = z.infer<
  typeof createOrganizationUserRepositorySchema
>;

export type CreateOrganizationUserBody = z.infer<
  typeof createOrganizationUserBodySchema
>;

export type UpdateOrganizationUserBody = z.infer<
  typeof updateOrganizationUserBodySchema
>;

/* =========================
   Params
========================= */

export type GetOrganizationUserByIdParams = z.infer<
  typeof getOrganizationUserByIdSchema
>;

/* =========================
   Responses
========================= */

export type MutateOrganizationUserResponse = z.infer<
  typeof mutateOrganizationUserResponseSchema
>;

export type OrganizationUserListResponse = z.infer<
  typeof organizationUserListResponseSchema
>;

export type GetOrganizationUserByIdResponse = z.infer<
  typeof getOrganizationUserByIdResponseSchema
>;
