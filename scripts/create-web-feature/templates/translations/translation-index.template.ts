export function translationsIndexTemplate({
  kebabCase,
}: {
  kebabCase: string;
}) {
  return `export * from "./hooks/use-${kebabCase}-translations";
`;
}
