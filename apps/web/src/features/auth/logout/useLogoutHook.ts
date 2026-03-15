import { useCommonTranslations } from "@/messages/common";
import { toast } from "sonner";

import { useLogout } from "@/src/api";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import { useQueryClient } from "@tanstack/react-query";
export function useLogoutHandler() {
  const { clearSelectedOrganizationId } = useSelectedOrganizationContext();
  const { statusTranslations } = useCommonTranslations();
  const queryClient = useQueryClient();
  const { mutateAsync: logoutMutate, isPending } = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.resetQueries();
        localStorage.removeItem("accessToken");
        clearSelectedOrganizationId();
        toast(statusTranslations("success"));

        location.reload();
      },
    },
  });

  const submit = async () => {
    await logoutMutate({ data: {} });
  };

  return { submit, isPending };
}
