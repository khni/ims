"use client";

import { useGetUnitById } from "@/src/api";
import { UpdateUnitForm } from "@/src/features/unit";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { selectedOrganizationId } = useSelectedOrganizationContext();
  const t = useTranslations();

  const { unitId } = React.use(params);
  const { data, isLoading } = useGetUnitById(unitId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data || !data?.data) {
    return "error";
  }

  return (
    <ListPageLayout
      LinkWrapper={Link}
      breadCrumbItems={[
        {
          href: "/workspace",
          name: t("common.headers.home"),
        },
        {
          href: `/workspace/${selectedOrganizationId}/units`,
          name: t("unit.headers.units"),
        },
      ]}
      dataTable={
        <UpdateUnitForm unit={data.data} />
      }
      resourceName={data.data.name}
    />
  );
}
