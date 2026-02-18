import i18n, { Resource, ResourceLanguage, TOptionsBase } from "i18next";
import organizationUserEn from "./organization-user/intl/locales/en.json" with { type: "json" };
import organizationUserAr from "./organization-user/intl/locales/ar.json" with { type: "json" };
import organizationEn from "./organization/intl/locales/en.json" with { type: "json" };
import organizationAr from "./organization/intl/locales/ar.json" with { type: "json" };
import { Messages } from "./organization-user/intl/types.js";

i18n.init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
      organizationUser: organizationUserEn,
      organization: organizationEn,
    },
    ar: {
      organizationUser: organizationUserAr,
      organization: organizationAr,
    },
  },

  ns: ["organizationUser", "organization"], // namespaces

  interpolation: {
    escapeValue: false,
  },
  keySeparator: ".",
});

export const trans = ({ lang }: { lang: "en" | "ar" }) => {
  const translation = i18n.getFixedT(lang);
  return translation;
};
