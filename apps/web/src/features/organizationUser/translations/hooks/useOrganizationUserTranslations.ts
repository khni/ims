// useOrganizationUserTranslations.ts
import { useTranslations } from "next-intl";

export const useOrganizationUserTranslations = () => {
  const organizationUserFormTranslations = useTranslations(
    "organizationUser.form",
  );
  const organizationUserFormFieldsTranslations = useTranslations(
    "organizationUser.form.fields",
  );
  const organizationUserHeaderTranslations = useTranslations(
    "organizationUser.headers",
  );
  const organizationUserColumnHeaderTranslations = useTranslations(
    "organizationUser.columnHeaders",
  );

  return {
    organizationUserFormTranslations,
    organizationUserFormFieldsTranslations,
    organizationUserHeaderTranslations,
    organizationUserColumnHeaderTranslations,
  };
};
