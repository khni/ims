// use-unit-translations.ts
import { useTranslations } from "next-intl";

export const useUnitTranslations = () => {
  const unitFormTranslations = useTranslations("unit.form");
  const unitFormFieldsTranslations = useTranslations("unit.form.fields");
  const unitHeaderTranslations = useTranslations("unit.headers");
  const unitColumnHeaderTranslations = useTranslations("unit.columnHeaders");

  return {
    unitFormTranslations,
    unitFormFieldsTranslations,
    unitHeaderTranslations,
    unitColumnHeaderTranslations,
  };
};
