"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useIsAuthenticated, useOrganizationList } from "@/src/api";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import { ROUTES } from "@/src/features/routes";

import NavbarContainer from "@/src/features/auth/NavbarContainer";
import CreateOrganizationForm from "@/src/features/organization/forms/CreateOrganizationForm";
import ComboBox from "@workspace/ui/blocks/combo-box";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";

import { useCommonTranslations } from "@/messages/common";
import { useTranslations } from "next-intl";

export default function Page() {
  const router = useRouter();

  // API
  const { data: authData, isLoading: isAuthLoading } = useIsAuthenticated({
    query: { queryKey: ["getAuthenticatedUser"], retry: 1 },
  });

  const { data: orgData, isPending: isOrgLoading } = useOrganizationList();

  const organizations = orgData?.data.list ?? [];

  // Context
  const { selectedOrganizationId, setSelectedOrganizationId } =
    useSelectedOrganizationContext();

  // Translations
  const { placeholderTranslations } = useCommonTranslations();
  const tOrg = useTranslations("organization");

  // Memoized options
  const orgOptions = useMemo(
    () =>
      organizations.map((org) => ({
        value: org.id,
        label: org.name,
      })),
    [organizations],
  );

  // Derived state
  const isLoading = isAuthLoading || isOrgLoading;

  const hasOrganizations = organizations.length > 0;

  const hasValidSelection =
    hasOrganizations &&
    selectedOrganizationId &&
    organizations.some((org) => org.id === selectedOrganizationId);

  // Redirects (before render)
  if (isLoading) {
    return <LoadingPage />;
  }

  if (authData && !authData.data) {
    router.replace(ROUTES.auth.index);
    return null;
  }

  if (hasValidSelection) {
    router.replace(ROUTES.app.index(selectedOrganizationId));
    return null;
  }

  // Empty state
  if (!hasOrganizations) {
    return (
      <NavbarContainer isLoading={isAuthLoading} user={authData?.data}>
        <CreateOrganizationForm />
      </NavbarContainer>
    );
  }

  // Main UI
  return (
    <NavbarContainer isLoading={isAuthLoading} user={authData?.data}>
      <div className="flex-1 flex flex-col gap-4 bg-muted items-center justify-center p-6 md:p-4">
        <div className="p-4">
          <h1 className="text-2xl text-center font-bold mb-4">
            {tOrg("headers.yourOrganizations")}
          </h1>

          <ComboBox
            selectText={placeholderTranslations("select")}
            list={orgOptions}
            onSelect={(value) => {
              setSelectedOrganizationId(value);
              router.push(ROUTES.app.index(value));
            }}
          />
        </div>
      </div>
    </NavbarContainer>
  );
}
