export function dataTableIndexTemplate({ kebabCase }: { kebabCase: string }) {
  return `export * from "./${kebabCase}-data-table";
`;
}
