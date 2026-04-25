import i18n from "i18next";

import authEn from "./locales/auth/en.json" with { type: "json" };
import authAr from "./locales/auth/ar.json" with { type: "json" };

import itemEn from "./locales/item/en.json" with { type: "json" };
import itemAr from "./locales/item/ar.json" with { type: "json" };

import organizationEn from "./locales/organization/en.json" with { type: "json" };
import organizationAr from "./locales/organization/ar.json" with { type: "json" };

import organizationUserEn from "./locales/organization-user/en.json" with { type: "json" };
import organizationUserAr from "./locales/organization-user/ar.json" with { type: "json" };

import permissionEn from "./locales/permission/en.json" with { type: "json" };
import permissionAr from "./locales/permission/ar.json" with { type: "json" };

import regionEn from "./locales/region/en.json" with { type: "json" };
import regionAr from "./locales/region/ar.json" with { type: "json" };

import roleEn from "./locales/role/en.json" with { type: "json" };
import roleAr from "./locales/role/ar.json" with { type: "json" };

import sidebarEn from "./locales/sidebar/en.json" with { type: "json" };
import sidebarAr from "./locales/sidebar/ar.json" with { type: "json" };

import unitEn from "./locales/unit/en.json" with { type: "json" };
import unitAr from "./locales/unit/ar.json" with { type: "json" };

import unitCollectionEn from "./locales/unit-collection/en.json" with { type: "json" };
import unitCollectionAr from "./locales/unit-collection/ar.json" with { type: "json" };

i18n.init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
      auth: authEn,
      item: itemEn,
      organization: organizationEn,
      organizationUser: organizationUserEn,
      permission: permissionEn,
      region: regionEn,
      role: roleEn,
      sidebar: sidebarEn,
      unit: unitEn,
      unitCollection: unitCollectionEn,
    },
    ar: {
      auth: authAr,
      item: itemAr,
      organization: organizationAr,
      organizationUser: organizationUserAr,
      permission: permissionAr,
      region: regionAr,
      role: roleAr,
      sidebar: sidebarAr,
      unit: unitAr,
      unitCollection: unitCollectionAr,
    },
  },

  ns: [
    "auth",
    "item",
    "organization",
    "organizationUser",
    "permission",
    "region",
    "role",
    "sidebar",
    "unit",
    "unitCollection"
  ],

  interpolation: {
    escapeValue: false,
  },
  keySeparator: ".",
});

export { i18n };
