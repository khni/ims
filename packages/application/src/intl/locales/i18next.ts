import i18n from "i18next";

import localesEn from "./locales/locales/en.json" with { type: "json" };
import localesAr from "./locales/locales/ar.json" with { type: "json" };

i18n.init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
      locales: localesEn,
    },
    ar: {
      locales: localesAr,
    },
  },

  ns: [
    "locales"
  ],

  interpolation: {
    escapeValue: false,
  },
  keySeparator: ".",
});

export const trans = ({ lang }: { lang: "en" | "ar" }) => {
  const translation = i18n.getFixedT(lang);
  return translation;
};
