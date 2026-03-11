import i18n from "i18next";
import organizationEn from "./locales/organization/en.json" with { type: "json" };
import organizationAr from "./locales/organization/ar.json" with { type: "json" };
import roleEn from "./locales/role/en.json" with { type: "json" };
import roleAr from "./locales/role/ar.json" with { type: "json" };
import authEn from "./locales/auth/en.json" with { type: "json" };
import authAr from "./locales/auth/ar.json" with { type: "json" };

i18n.init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
      organization: organizationEn,
      role: roleEn,

      auth: authEn,
    },
    ar: {
      organization: organizationAr,
      role: roleAr,
      auth: authAr,
    },
  },

  ns: ["organization", "auth", "role"], // namespaces

  interpolation: {
    escapeValue: false,
  },
  keySeparator: ".",
});

export const trans = ({ lang }: { lang: "en" | "ar" }) => {
  const translation = i18n.getFixedT(lang);
  return translation;
};

// example usage
/**
 * const t = trans({lang:"en"})
t("organization:errors.MODULE_NAME_CONFLICT")
 */
