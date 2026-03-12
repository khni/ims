import { OrganizationUserStatus } from "@avuny/db/enums";

import { z } from "@avuny/zod";

export const organizationUserSchema = z.object({
  name: z.string(),
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  organizationId: z.string(),
  status: z.nativeEnum(OrganizationUserStatus),
  expiresAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// body schemas
export const mutateOrganizationUserSchema = organizationUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  organizationId: true,
});

export const createOrganizationUserBodySchema = mutateOrganizationUserSchema;

// params schema
export const updateOrganizationUserBodySchema = mutateOrganizationUserSchema;

export const getOrganizationUserByIdSchema = organizationUserSchema.pick({
  id: true,
});

// Response schemas
export const mutateOrganizationUserResponseSchema = organizationUserSchema.pick(
  {
    id: true,
    name: true,
  },
);

export const organizationUserListResponseSchema = organizationUserSchema
  .pick({
    id: true,
    name: true,

    updatedAt: true,
  })
  .array();

export const getOrganizationUserByIdResponseSchema =
  organizationUserSchema.pick({
    id: true,
    name: true,
  });
