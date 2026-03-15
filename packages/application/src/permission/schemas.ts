import { ActionName, ResourceName } from "@avuny/db";
import { z } from "@avuny/zod";

export const ActionSchema = z.object({
  id: z.string(),
  name: z.enum(ActionName),
  description: z.string().nullable(),
});

export const ResourceSchema = z.object({
  id: z.string(),
  name: z.enum(ResourceName),
  description: z.string().nullable(),
});

export const PermissionSchema = z.object({
  id: z.string(),
  actionId: z.string(),
  resourceId: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  isDangerous: z.boolean(),
});

export const PermissionsMatrixSchema = z.object({
  actions: z.array(ActionSchema),
  resources: z.array(ResourceSchema),
  permissions: z.array(PermissionSchema),
});
