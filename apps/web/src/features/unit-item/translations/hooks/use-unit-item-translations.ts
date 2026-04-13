// use-unit-item-translations.ts
import { useTranslations } from "next-intl";

export const useUnitItemTranslations = () => {
  const unitItemFormTranslations = useTranslations("unitItem.form");
  const unitItemFormFieldsTranslations = useTranslations("unitItem.form.fields");
  const unitItemHeaderTranslations = useTranslations("unitItem.headers");
  const unitItemColumnHeaderTranslations = useTranslations("unitItem.columnHeaders");

  return {
    unitItemFormTranslations,
    unitItemFormFieldsTranslations,
    unitItemHeaderTranslations,
    unitItemColumnHeaderTranslations,
  };
};
