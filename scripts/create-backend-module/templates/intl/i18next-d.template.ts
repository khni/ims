import { toCamelCase, toPascalCase } from "../../../utils/cases";

export function i18nTypesTemplate({
  modules,
}: {
  modules: string[]; // camelCase feature names
}) {
  const importLines = modules
    .map(
      (f) =>
        `import type ${toCamelCase(f)}En from "./locales/${f.replace(
          /[A-Z]/g,
          (m) => `-${toCamelCase(m)}`,
        )}/en.json";`,
    )
    .join("\n");

  const typeLines = modules
    .map((f) => `type ${toPascalCase(f)}Messages = typeof ${toCamelCase(f)}En;`)
    .join("\n");

  const resourceLines = modules
    .map((f) => `      ${toCamelCase(f)}: ${toPascalCase(f)}Messages;`)
    .join("\n");

  return `${importLines}

${typeLines}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
${resourceLines}
    };
  }
}
`;
}
