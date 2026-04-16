import {
  ActionName,
  ResourceName,
  SystemCustomPermission,
} from "@avuny/db/enums";
import { z } from "@avuny/zod";

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isSystem: z.boolean(),
  priority: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().nullable(),
  organizationId: z.string(),
});

// body schemas
export const mutateRoleSchema = roleSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    organizationId: true,
    priority: true,
    isSystem: true,
    expiresAt: true,
  })
  .extend({
    permissions: z
      .object({
        permissionId: z.uuid(),
      })
      .array(),
    customPermissions: z
      .object({
        code: z.enum(SystemCustomPermission),
      })
      .array()
      .optional(),
  });
export const createRoleBodySchema = mutateRoleSchema;

// params schema
export const updateRoleBodySchema = mutateRoleSchema;

export const getRoleByIdSchema = roleSchema.pick({ id: true });

// Response schemas
export const mutateRoleResponseSchema = roleSchema.pick({
  id: true,
  name: true,
});

export const roleListResponseSchema = roleSchema
  .pick({
    id: true,
    name: true,
    description: true,
    updatedAt: true,
  })
  .array();

export const getRoleByIdResponseSchema = roleSchema
  .pick({
    id: true,
    name: true,
    description: true,
  })
  .extend({
    rolePermissions: z.array(
      z.object({
        id: z.uuid(),
        permissionId: z.uuid(),
        permission: z.object({
          action: z.object({
            name: z.enum(ActionName),
          }),
          resource: z.object({
            name: z.enum(ResourceName),
          }),
        }),
      }),
    ),

    roleCustomPermissions: z.array(
      z.object({
        customPermission: z.object({
          code: z.enum(SystemCustomPermission),
        }),
      }),
    ),
  });
