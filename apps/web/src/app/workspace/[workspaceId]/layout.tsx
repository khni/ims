"use client";
import React, { ReactNode } from "react";

import { CustomLayout } from "@workspace/ui/blocks/layout/custom-layout";
import { NavMain } from "@workspace/ui/blocks/layout/nav-main";
import { Switcher } from "@workspace/ui/blocks/layout/switcher";
import ModeSwitcherBtn from "@/src/components/buttons/mode-switcher-btn";
import HomeButton from "@/src/components/buttons/home-btn";
import { getLocale } from "next-intl/server";
import {
  userPreferencesContext,
  useUserPreferencesContext,
} from "@workspace/ui/providers/UserPreferencesContext";
import LangaugeSwitcherBtn from "@/src/components/buttons/langauge-switcher-btn";
import {
  useGetSidebar,
  useIsAuthenticated,
  useOrganizationList,
} from "@/src/api";
import UserButton from "@/src/components/buttons/user-btn";
import { useLogoutHandler } from "@/src/features/auth/logout/useLogoutHook";
import { useCommonTranslations } from "@/messages/common";
import { useTranslations } from "next-intl";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import { ROUTES } from "@/src/features/routes";
import { usePathname, useRouter } from "next/navigation";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import useOrganizationListHandler from "@/src/features/organization/list/hooks/useOrganizationListHandler";

export default function WorkSpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { locale, rtl } = useUserPreferencesContext();
  const { workspaceId } = React.use(params);
  const { data: sidebarData } = useGetSidebar();
  const pathName = usePathname();
  const { data, isLoading } = useIsAuthenticated({
    query: {
      queryKey: ["getAuthenticatedUser"],
      retry: 1,
    },
  });
  const router = useRouter();
  const { organizationList, isPending } = useOrganizationListHandler();
  const orgList = organizationList?.list;
  const { selectedOrganizationId, setSelectedOrganizationId } =
    useSelectedOrganizationContext();
  if (isPending) {
    return <LoadingPage />;
  }

  return (
    <CustomLayout
      rtl={rtl}
      start={<HomeButton />}
      end={
        <>
          <ModeSwitcherBtn /> <LangaugeSwitcherBtn />{" "}
          <UserButton
            useLogoutHandler={useLogoutHandler}
            isLoading={isLoading}
            user={data?.data}
          />
        </>
      }
      sidebarHeader={
        <Switcher
          onItemSelect={(id) => {
            const found = orgList?.find((org) => org.id === id);
            if (found) {
              router.replace(ROUTES.app.index(id));
            }
            setSelectedOrganizationId(id);
          }}
          initialSelectedItem={orgList?.find(
            (org) => org.id === selectedOrganizationId,
          )}
          items={
            orgList?.map((org) => ({
              name: org.name,
              description: org.description || "Admin",
              //  logo: HomeIcon,
              id: org.id,
            })) || []
          }
          // TODO: Pass the correct prop for selection if Switcher supports it
          onAddClick={() => router.push(ROUTES.app.create_org)}
        />
      }
      sidebarContent={
        <>
          <NavMain
            onSubItemClick={(subitem) =>
              router.replace(
                subitem.path.replace(":orgId", selectedOrganizationId!),
              )
            }
            isSubItemActive={(subItem) =>
              pathName.includes(subItem.name.toLowerCase())
            }
            isItemActive={(item) =>
              !!item.options?.find((subItem) =>
                pathName.includes(subItem.name.toLowerCase()),
              )
            }
            items={sidebarData ?? []}
          />
        </>
      }
    >
      {children}
    </CustomLayout>
  );
}
