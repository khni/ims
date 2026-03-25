"use client";
import { useCommonTranslations } from "@/messages/common";
import { useGetRoleById } from "@/src/api";
import { RoleFormButton, UpdateRoleForm } from "@/src/features/role";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import { CustomBreadCrumb } from "@workspace/ui/blocks/custom-bread-crumb";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { selectedOrganizationId } = useSelectedOrganizationContext();
  const t = useTranslations();
  const { roleId } = React.use(params);
  const { data, isLoading } = useGetRoleById(roleId);
  if (isLoading) {
    return <LoadingPage />;
  }
  if (!data || !data?.data) {
    return "error";
  }

  return (
    <>
      <ListPageLayout
        LinkWrapper={Link}
        breadCrumbItems={[
          {
            href: "/workspace",
            name: t("common.headers.home"),
          },
          {
            href: `/workspace/${selectedOrganizationId}/roles`,
            name: t("role.headers.roles"),
          },
        ]}
        dataTable={<UpdateRoleForm role={data.data} />}
        resourceName={data.data.name}
      />
    </>
  );
}
