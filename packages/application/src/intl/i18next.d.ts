import type authEn from "./locales/auth/en.json";
import type itemEn from "./locales/item/en.json";
import type organizationEn from "./locales/organization/en.json";
import type organizationUserEn from "./locales/organization-user/en.json";
import type permissionEn from "./locales/permission/en.json";
import type regionEn from "./locales/region/en.json";
import type roleEn from "./locales/role/en.json";
import type sidebarEn from "./locales/sidebar/en.json";

type AuthMessages = typeof authEn;
type ItemMessages = typeof itemEn;
type OrganizationMessages = typeof organizationEn;
type OrganizationUserMessages = typeof organizationUserEn;
type PermissionMessages = typeof permissionEn;
type RegionMessages = typeof regionEn;
type RoleMessages = typeof roleEn;
type SidebarMessages = typeof sidebarEn;

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
    };
  }
}
