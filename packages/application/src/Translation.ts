import i18n from "i18next";
import commonEn from "./intl/locales/en.json" with { type: "json" };
import commonAr from "./intl/locales/ar.json" with { type: "json" };

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
