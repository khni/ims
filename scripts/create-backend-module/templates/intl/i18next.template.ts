import { toCamelCase } from "../../../utils/cases";

export function i18nInitTemplate({
  modules,
}: {
  modules: string[]; // camelCase
}) {
  const importLines = modules
    .map((f) => {
      return `import ${toCamelCase(f)}En from "./locales/${f}/en.json" with { type: "json" };
import ${toCamelCase(f)}Ar from "./locales/${f}/ar.json" with { type: "json" };`;
    })
    .join("\n\n");

  const enResources = modules
    .map((f) => `      ${toCamelCase(f)}: ${toCamelCase(f)}En,`)
    .join("\n");

  const arResources = modules
    .map((f) => `      ${toCamelCase(f)}: ${toCamelCase(f)}Ar,`)
    .join("\n");

  const namespaces = modules.map((f) => `"${toCamelCase(f)}"`).join(",\n    ");

  return `import i18n from "i18next";

${importLines}

i18n.init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
${enResources}
    },
    ar: {
${arResources}
    },
  },

  ns: [
    ${namespaces}
  ],

  interpolation: {
    escapeValue: false,
  },
  keySeparator: ".",
});

export { i18n };
`;
}
