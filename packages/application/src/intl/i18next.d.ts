import type organizationEn from "./locales/organization/en.json";
import type authEn from "./locales/auth/en.json";

type OrganizationMessages = typeof organizationEn;
type AuthMessages = typeof authEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      organization: OrganizationMessages;
      auth: AuthMessages;
    };
  }
}
