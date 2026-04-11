export function translationsHookTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: {
  featurePascal: string;
  featureCamel: string;
  kebabCase: string;
}) {
  return `// use-${kebabCase}-translations.ts
import { useTranslations } from "next-intl";

export const use${featurePascal}Translations = () => {
  const ${featureCamel}FormTranslations = useTranslations("${featureCamel}.form");
  const ${featureCamel}FormFieldsTranslations = useTranslations("${featureCamel}.form.fields");
  const ${featureCamel}HeaderTranslations = useTranslations("${featureCamel}.headers");
  const ${featureCamel}ColumnHeaderTranslations = useTranslations("${featureCamel}.columnHeaders");

  return {
    ${featureCamel}FormTranslations,
    ${featureCamel}FormFieldsTranslations,
    ${featureCamel}HeaderTranslations,
    ${featureCamel}ColumnHeaderTranslations,
  };
};
`;
}
