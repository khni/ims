"use client";

import { useGetUnitCollectionById } from "@/src/api";
import { UpdateUnitCollectionForm } from "@/src/features/unit-collection";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ unitCollectionId: string }>;
}) {
  const { selectedOrganizationId } = useSelectedOrganizationContext();
  const t = useTranslations();

  const { unitCollectionId } = React.use(params);
  const { data, isLoading } = useGetUnitCollectionById(unitCollectionId);

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
          href: `/workspace/${selectedOrganizationId}/unit-collections`,
          name: t("unitCollection.headers.unitCollections"),
        },
      ]}
      dataTable={
        <UpdateUnitCollectionForm unitCollection={data.data} />
      }
      resourceName={data.data.name}
    />
  );
}
