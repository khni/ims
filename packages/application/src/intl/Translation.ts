import i18n from "i18next";
import commonEn from "./locales/common/en.json" with { type: "json" };
import commonAr from "./locales/common/ar.json" with { type: "json" };

i18n.init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
      common: commonEn,
    },
    ar: {
      common: commonAr,
    },
  },

  ns: ["common"], // namespaces

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
t("common:errors.MODULE_NAME_CONFLICT")
 */
