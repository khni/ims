import { z } from "@avuny/zod";
import {
  sidebarItemSchema,
  sidebarItemsSchema,
  sidebarOptionSchema,
} from "./schemas.js";

export type SidebarItem = z.infer<typeof sidebarItemSchema>;
export type SidebarItems = z.infer<typeof sidebarItemsSchema>;
export type SidebarOption = z.infer<typeof sidebarOptionSchema>;
export type SidebarOptions = z.infer<typeof sidebarOptionSchema>;
