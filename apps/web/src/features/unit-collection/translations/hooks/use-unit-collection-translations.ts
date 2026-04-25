// use-unit-collection-translations.ts
import { useTranslations } from "next-intl";

export const useUnitCollectionTranslations = () => {
  const unitCollectionFormTranslations = useTranslations("unitCollection.form");
  const unitCollectionFormFieldsTranslations = useTranslations("unitCollection.form.fields");
  const unitCollectionHeaderTranslations = useTranslations("unitCollection.headers");
  const unitCollectionColumnHeaderTranslations = useTranslations("unitCollection.columnHeaders");

  return {
    unitCollectionFormTranslations,
    unitCollectionFormFieldsTranslations,
    unitCollectionHeaderTranslations,
    unitCollectionColumnHeaderTranslations,
  };
};
