import { toCamelCase } from "../../../utils/cases";

export function moduleDepsTemplate({ modules }: { modules: string[] }) {
  const importLines = modules
    .map(
      (m) =>
        `import { ${toCamelCase(m)}Deps } from "./${m}/container-deps.js";`,
    )
    .join("\n");

  const spreadLines = modules
    .map((m) => `  ...${toCamelCase(m)}Deps,`)
    .join("\n");

  return `${importLines}

/**
 * Aggregated Module Dependencies
 *
 * Combines all feature deps into a single object
 * to be registered in the DI container.
 */
export const moduleDeps = {
${spreadLines}
};
`;
}
