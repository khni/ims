import { toCamelCase } from "../../utils/cases";

/**
 * Generates src/messages/types.ts aggregator for en.json
 * Note: imports are static for en.json so bundlers can analyze them.
 */
export function messageIndexTemplate({
  features,
  dirs,
}: {
  features: string[];
  dirs: {
    translations: string;
    messages: string;
  };
}) {
  const imports = [`import commonMessages from "./common/en.json";`].concat(
    features.map(
      (f) =>
        `import ${toCamelCase(f)}Messages from "../src/features/${f}/${dirs.translations}/${dirs.messages}/en.json";`,
    ),
  );

  const typesUnion = ["typeof commonMessages"]
    .concat(features.map((f) => `typeof ${toCamelCase(f)}Messages`))
    .join(" &\n  ");

  const spreadParts = ["...commonMessages"]
    .concat(features.map((f) => `...${toCamelCase(f)}Messages`))
    .join(",\n  ");

  return `${imports.join("\n")}

export type Messages = ${typesUnion};

export const messages: Messages = {
  ${spreadParts}
};
`;
}
