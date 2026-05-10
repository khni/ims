// use-warehouse-translations.ts
import { useTranslations } from "next-intl";

export const useWarehouseTranslations = () => {
  const warehouseFormTranslations = useTranslations("warehouse.form");
  const warehouseFormFieldsTranslations = useTranslations("warehouse.form.fields");
  const warehouseHeaderTranslations = useTranslations("warehouse.headers");
  const warehouseColumnHeaderTranslations = useTranslations("warehouse.columnHeaders");

  return {
    warehouseFormTranslations,
    warehouseFormFieldsTranslations,
    warehouseHeaderTranslations,
    warehouseColumnHeaderTranslations,
  };
};
