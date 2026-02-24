import type commonEn from "./locales/common/en.json";

type CommonMessages = typeof commonEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      common: CommonMessages;
    };
  }
}
