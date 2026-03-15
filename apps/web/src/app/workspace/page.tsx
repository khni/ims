"use client";
import React, { useEffect } from "react";
import { Navbar } from "@workspace/ui/blocks/layout/navbar";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import HomeButton from "@/src/components/buttons/home-btn";
import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import { useIsAuthenticated, useOrganizationList } from "@/src/api";
import UserButton from "@/src/components/buttons/user-btn";
import { useLogoutHandler } from "@/src/features/auth/logout/useLogoutHook";
import CreateOrganizationForm from "@/src/features/organization/forms/CreateOrganizationForm";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/features/routes";
import ComboBox from "@workspace/ui/blocks/combo-box";
import { is } from "zod/v4/locales";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { useCommonTranslations } from "@/messages/common";
import { useTranslations } from "next-intl";
import NavbarContainer from "@/src/features/auth/NavbarContainer";
//snp rfc
export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useIsAuthenticated({
    query: {
      queryKey: ["getAuthenticatedUser"],
      retry: 1,
    },
  });
  const { data: orgData, isPending } = useOrganizationList();
  const { placeholderTranslations } = useCommonTranslations();
  const organizationTranslations = useTranslations("organization");
  const organizations = orgData?.data || [];
  const { selectedOrganizationId, setSelectedOrganizationId } =
    useSelectedOrganizationContext();
  useEffect(() => {
    if (!data?.data) {
      router.replace(ROUTES.auth.index);
    }
    if (!organizations || organizations.length === 0) return;

    const found = organizations.find(
      (org) => org.id === selectedOrganizationId,
    );
    if (found) {
      router.replace(ROUTES.app.index(selectedOrganizationId));
    }
  }, [organizations, selectedOrganizationId, router]);

  if (isPending) {
    return <LoadingPage />;
  }

  if (organizations.length === 0) {
    return (
      <NavbarContainer isLoading={isLoading} user={data?.data}>
        {<CreateOrganizationForm />}
      </NavbarContainer>
    );
  }
  return (
    <NavbarContainer isLoading={isLoading} user={data?.data}>
      <div className="flex-1 flex flex-col gap-4 bg-muted items-center justify-center p-6 md:p-4">
        <div className="p-4">
          <h1 className="text-2xl text-center font-bold mb-4">
            {organizationTranslations("headers.yourOrganizations")}
          </h1>
          <ul className="space-y-2">
            <ComboBox
              selectText={placeholderTranslations("select")}
              list={organizations.map((org) => ({
                value: org.id,
                label: org.name,
              }))}
              onSelect={(value) => {
                setSelectedOrganizationId(value);
                router.push(ROUTES.app.index(value));
              }}
            />
          </ul>
        </div>
      </div>
    </NavbarContainer>
  );
}
