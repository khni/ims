// useItemTranslations.ts
import { useTranslations } from "next-intl";

export const useItemTranslations = () => {
  const itemFormTranslations = useTranslations("item.form");
  const itemFormFieldsTranslations = useTranslations("item.form.fields");
  const itemHeaderTranslations = useTranslations("item.headers");
  const itemColumnHeaderTranslations = useTranslations("item.columnHeaders");

  return {
    itemFormTranslations,
    itemFormFieldsTranslations,
    itemHeaderTranslations,
    itemColumnHeaderTranslations,
  };
};
