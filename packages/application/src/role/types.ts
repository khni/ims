import { z } from "@hono/zod-openapi";
import {
  roleSchema,
  createRoleBodySchema,
  updateRoleBodySchema,
  getRoleByIdSchema,
  getRoleByIdResponseSchema,
  mutateRoleResponseSchema,
  roleListResponseSchema,
  mutateRoleSchema,
} from "./schemas.js";

/* =========================
   Base 
========================= */

export type Role = z.infer<typeof roleSchema>;

/* =========================
   Request Bodies
========================= */
export type MutateRoleBody = z.infer<typeof mutateRoleSchema>;

export type CreateRoleBody = z.infer<typeof createRoleBodySchema>;

export type UpdateRoleBody = z.infer<typeof updateRoleBodySchema>;

/* =========================
   Params
========================= */

export type GetRoleByIdParams = z.infer<typeof getRoleByIdSchema>;

/* =========================
   Responses
========================= */

export type MutateRoleResponse = z.infer<typeof mutateRoleResponseSchema>;

export type RoleListResponse = z.infer<typeof roleListResponseSchema>;

export type GetRoleByIdResponse = z.infer<typeof getRoleByIdResponseSchema>;
