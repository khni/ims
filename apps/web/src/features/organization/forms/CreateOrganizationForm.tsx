import { useCountryList, useCreateOrganization, useStateList } from "@/src/api";
import OrganizationFormDetails from "@/src/features/organization/forms/OrganizationFormDetails";
import { organizationListQueryKey } from "@/src/features/organization/list/queryKeys";
import { ROUTES } from "@/src/features/routes";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

function CreateOrganizationForm() {
  const [countryId, setCountryId] = React.useState<string | null>(null);
  const { data } = useCountryList();
  const router = useRouter();
  const { setSelectedOrganizationId } = useSelectedOrganizationContext();
  const queryClient = useQueryClient();
  const { isLoading: isStatesLoading, data: statesData } = useStateList(
    { countryId: countryId || "" },
    {
      query: {
        enabled: !!countryId,
        queryKey: ["states", countryId],
      },
    },
  );
  const { mutateAsync, error, isPending } = useCreateOrganization({
    mutation: {
      onSuccess: (data) => {
        //invalidate organization list
        queryClient.invalidateQueries({
          queryKey: organizationListQueryKey,
        });
        setSelectedOrganizationId(data.data.id);
        return router.push(ROUTES.app.index(data.data.id));
      },
    },
  });
  return (
    <OrganizationFormDetails
      countries={data || []}
      states={statesData || []}
      setCountryId={setCountryId}
      customForm={{
        error,
        api: {
          onSubmit: async (data) => await mutateAsync({ data }),
          isLoading: isPending,
        },
      }}
    />
  );
}

export default CreateOrganizationForm;
