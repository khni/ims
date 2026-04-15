import type localesEn from "./locales/locales/en.json";

type LocalesMessages = typeof localesEn;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      locales: LocalesMessages;
    };
  }
}
