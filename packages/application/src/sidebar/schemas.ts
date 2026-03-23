import { SidebarHeadingType } from "@avuny/db";
import { z } from "@avuny/zod";

export const sidebarOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  path: z.string().optional(),
});
export const sidebarOptionsSchema = z.array(sidebarOptionSchema);

export const sidebarItemSchema = z.object({
  id: z.string(),
  name: z.enum(SidebarHeadingType),
  icon: z.string().nullable().optional(),
  options: sidebarOptionsSchema,
});

export const sidebarItemsSchema = z.array(sidebarItemSchema);
