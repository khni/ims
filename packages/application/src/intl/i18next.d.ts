import type organizationEn from "./locales/organization/en.json";

type OrganizationMessages = typeof organizationEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      organization: OrganizationMessages;
    };
  }
}
