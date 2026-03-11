import type organizationEn from "./locales/organization/en.json";
import type roleEn from "./locales/role/en.json";
import type authEn from "./locales/auth/en.json";

type OrganizationMessages = typeof organizationEn;
type RoleMessages = typeof roleEn;
type AuthMessages = typeof authEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      organization: OrganizationMessages;
      auth: AuthMessages;
      role: RoleMessages;
    };
  }
}
