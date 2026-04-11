export function featureMessagesTypeTemplate({
  featurePascal,
  featureCamel,
}: {
  featurePascal: string;
  featureCamel: string;
}) {
  return `import ${featureCamel}Messages from "./en.json";
export type ${featurePascal}Messages = typeof ${featureCamel}Messages;

export const ${featurePascal}Messages: ${featurePascal}Messages = {
  ...${featureCamel}Messages,
};
`;
}
