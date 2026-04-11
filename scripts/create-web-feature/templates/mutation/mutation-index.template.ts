export function formIndexTemplate({ featureCamel }: { featureCamel: string }) {
  return `export * from "./update-${featureCamel}.form";
export * from "./create-${featureCamel}.form";
export * from "./${featureCamel}.form-button";
`;
}
