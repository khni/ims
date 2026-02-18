import type organizationEn from "../organization/intl/locales/en.json";
import type organizationUserEn from "../organization-user/intl/locales/en.json";
type OrganizationMessages = typeof organizationEn;
type OrganizationUserMessages = typeof organizationUserEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      organization: OrganizationMessages;
      organizationUser: OrganizationUserMessages;
    };
  }
}
