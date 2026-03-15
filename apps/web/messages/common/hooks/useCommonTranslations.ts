import { useTranslations } from "next-intl";

export const useCommonTranslations = () => {
  const actionTranslations = useTranslations("common.actions");
  const msgTranslations = useTranslations("common.msgs");
  const entityTranslations = useTranslations("common.entities");
  const placeholderTranslations = useTranslations("common.placeholders");
  const statusTranslations = useTranslations("common.status");
  const validationTranslations = useTranslations("common.validation");
  const alertMsgsTranslations = useTranslations("common.alertMsgs");

  return {
    actionTranslations,
    msgTranslations,
    entityTranslations,
    placeholderTranslations,
    statusTranslations,
    validationTranslations,
    alertMsgsTranslations,
  };
};
