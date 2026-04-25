import { useQueryClient } from "@tanstack/react-query";
import CustomForm, {
  CustomFormProps,
} from "@workspace/ui/blocks/form/custom-form";
import {
  ErrorAlert,
  ErrorAlertProps,
} from "@workspace/ui/blocks/form/ErrorAlert-v2";

import { useCommonTranslations } from "messages/common/hooks/useCommonTranslations";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
export type FormProps<T extends FieldValues, E, S extends string> = {
  children?: React.ReactNode;
  actionName?: "create" | "add" | "update";
  resourceName?:
    | "organization"
    | "role"
    | "item"
    | "organizationUser"
    | "unit"
    | "unitCollection";
  queryInvalidateKey?: readonly [string, ...any[]] | [string, ...any[]];
} & Omit<
  CustomFormProps<T, E>,
  "isLoadingText" | "submitButtonText" | "children"
> &
  Pick<ErrorAlertProps<S>, "error" | "errorMap" | "errorTitle">;
export const Form = <T extends FieldValues, E, S extends string>({
  form,
  api,
  fields,
  getLabel,
  error,
  errorMap,
  cardTitle,
  cardDescription,
  children,
  actionName,
  resourceName,
  queryInvalidateKey,
}: FormProps<T, E, S>) => {
  const {
    placeholderTranslations,
    alertMsgsTranslations,
    statusTranslations,
    actionTranslations,
    msgTranslations,
    entityTranslations,
  } = useCommonTranslations();
  const thing = resourceName ? entityTranslations(resourceName) : "";
  const action = actionName ? actionTranslations(actionName) : "";
  const cardTitleFinal =
    cardTitle ||
    msgTranslations("actionThingTitle", {
      action,
      thing,
    });
  const cardDescriptionFinal =
    cardDescription ||
    msgTranslations("actionThingDescription", {
      action,
      thing,
    });

  const successToast = msgTranslations(actionName || "save", {
    thing,
  });
  const queryClient = useQueryClient();

  return (
    <CustomForm
      form={form}
      getLabel={getLabel}
      api={api}
      onSuccess={(data) => {
        toast.success(successToast);
        queryInvalidateKey &&
          queryClient.invalidateQueries({
            queryKey: queryInvalidateKey,
          });
      }}
      fields={fields}
      isLoadingText={placeholderTranslations("loading")}
      submitButtonText={actionTranslations("submit")}
      cardTitle={cardTitleFinal}
      cardDescription={cardDescriptionFinal}
    >
      {children}
      <ErrorAlert
        errorTitle={statusTranslations("error")}
        // errorDescriptionFallback={alertMsgsTranslations("unknownError")}
        error={error}
        errorMap={errorMap}
      />
    </CustomForm>
  );
};
