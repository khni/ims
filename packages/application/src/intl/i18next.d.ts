import type authEn from "./locales/auth/en.json";
import type itemEn from "./locales/item/en.json";
import type organizationEn from "./locales/organization/en.json";
import type organizationUserEn from "./locales/organization-user/en.json";
import type permissionEn from "./locales/permission/en.json";
import type regionEn from "./locales/region/en.json";
import type roleEn from "./locales/role/en.json";
import type sidebarEn from "./locales/sidebar/en.json";
import type unitEn from "./locales/unit/en.json";
import type unitCollectionEn from "./locales/unit-collection/en.json";
import type warehouseEn from "./locales/warehouse/en.json";

type AuthMessages = typeof authEn;
type ItemMessages = typeof itemEn;
type OrganizationMessages = typeof organizationEn;
type OrganizationUserMessages = typeof organizationUserEn;
type PermissionMessages = typeof permissionEn;
type RegionMessages = typeof regionEn;
type RoleMessages = typeof roleEn;
type SidebarMessages = typeof sidebarEn;
type UnitMessages = typeof unitEn;
type UnitCollectionMessages = typeof unitCollectionEn;
type WarehouseMessages = typeof warehouseEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      auth: AuthMessages;
      item: ItemMessages;
      organization: OrganizationMessages;
      organizationUser: OrganizationUserMessages;
      permission: PermissionMessages;
      region: RegionMessages;
      role: RoleMessages;
      sidebar: SidebarMessages;
      unit: UnitMessages;
      unitCollection: UnitCollectionMessages;
      warehouse: WarehouseMessages;
    };
  }
}
