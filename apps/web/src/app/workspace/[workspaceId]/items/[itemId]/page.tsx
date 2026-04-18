"use client";

import { useGetItemById } from "@/src/api";
import { UpdateItemForm } from "@/src/features/item";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { selectedOrganizationId } = useSelectedOrganizationContext();
  const t = useTranslations();

  const { itemId } = React.use(params);
  const { data, isLoading } = useGetItemById(itemId);

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
          href: `/workspace/${selectedOrganizationId}/items`,
          name: t("item.headers.items"),
        },
      ]}
      dataTable={
        <UpdateItemForm item={data.data} />
      }
      resourceName={data.data.name}
    />
  );
}
