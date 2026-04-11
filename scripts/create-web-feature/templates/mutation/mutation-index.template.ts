export function formIndexTemplate({ kebabCase }: { kebabCase: string }) {
  return `export * from "./update-${kebabCase}-form";
export * from "./create-${kebabCase}-form";
export * from "./${kebabCase}-form-button";
`;
}
