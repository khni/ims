import { toCamelCase } from "../../../utils/cases";

export function typesIndexTemplate({ modules }: { modules: string[] }) {
  const imports = modules.map((m) => `export * from "./${m}/types.js";`);

  return `${imports.join("\n")}

`;
}
