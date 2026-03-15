import { useIsAuthenticated, useOrganizationList } from "@/src/api";
import { organizationListQueryKey } from "@/src/features/organization/list/queryKeys";
import React from "react";

const useOrganizationListHandler = () => {
  const { data, isPending } = useOrganizationList({
    query: {
      queryKey: organizationListQueryKey,
      retry: 1,
    },
  });
  return {
    organizationList: data?.data || [],
    isPending,
  };
};

export default useOrganizationListHandler;
