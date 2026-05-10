"use client";

import { useGetWarehouseById } from "@/src/api";
import { UpdateWarehouseForm } from "@/src/features/warehouse";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ warehouseId: string }>;
}) {
  const { selectedOrganizationId } = useSelectedOrganizationContext();
  const t = useTranslations();

  const { warehouseId } = React.use(params);
  const { data, isLoading } = useGetWarehouseById(warehouseId);

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
          href: `/workspace/${selectedOrganizationId}/warehouses`,
          name: t("warehouse.headers.warehouses"),
        },
      ]}
      dataTable={<UpdateWarehouseForm warehouse={data.data} />}
      resourceName={data.data.name}
    />
  );
}
