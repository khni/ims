import { toCamelCase } from "../../../utils/cases";

export function schemasIndexTemplate({ modules }: { modules: string[] }) {
  const imports = modules.map((m) => `export * from "./${m}/schemas.js";`);

  return `${imports.join("\n")}

`;
}
