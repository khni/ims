"use client";
import React, { useEffect, useMemo } from "react";
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

  // 🔹 API calls
  const { data: authData, isLoading: isAuthLoading } = useIsAuthenticated({
    query: { queryKey: ["getAuthenticatedUser"], retry: 1 },
  });

  const { data: orgData, isPending: isOrgLoading } = useOrganizationList();

  const organizations = orgData?.data.list ?? [];

  // 🔹 Context
  const { selectedOrganizationId, setSelectedOrganizationId } =
    useSelectedOrganizationContext();

  // 🔹 Translations
  const { placeholderTranslations } = useCommonTranslations();
  const tOrg = useTranslations("organization");

  // 🔹 Memoized options (prevents re-creation on every render)
  const orgOptions = useMemo(
    () =>
      organizations.map((org) => ({
        value: org.id,
        label: org.name,
      })),
    [organizations],
  );

  // 🔹 Redirect logic (split for clarity + fewer triggers)
  useEffect(() => {
    if (authData && !authData.data) {
      router.replace(ROUTES.auth.index);
    }
  }, [authData, router]);

  useEffect(() => {
    if (!organizations.length) return;

    const found = organizations.some(
      (org) => org.id === selectedOrganizationId,
    );

    if (found) {
      router.replace(ROUTES.app.index(selectedOrganizationId));
    }
  }, [selectedOrganizationId, organizations.length, router]);

  // 🔹 Loading state
  if (isOrgLoading) return <LoadingPage />;

  // 🔹 Empty state
  if (!organizations.length) {
    return (
      <NavbarContainer isLoading={isAuthLoading} user={authData?.data}>
        <CreateOrganizationForm />
      </NavbarContainer>
    );
  }

  // 🔹 UI
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
