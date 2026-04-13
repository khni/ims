import { Context } from "../../../types";

export function detailsPageTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
  pluralKebabCase,
  pluralFeatureCamel,
}: Context) {
  return `"use client";

import { useGet${featurePascal}ById } from "@/src/api";
import { Update${featurePascal}Form } from "@/src/features/${kebabCase}";
import { useSelectedOrganizationContext } from "@/src/providers/selected-org-provider";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ ${featureCamel}Id: string }>;
}) {
  const { selectedOrganizationId } = useSelectedOrganizationContext();
  const t = useTranslations();

  const { ${featureCamel}Id } = React.use(params);
  const { data, isLoading } = useGet${featurePascal}ById(${featureCamel}Id);

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
          href: \`/workspace/\${selectedOrganizationId}/${pluralKebabCase}\`,
          name: t("${featureCamel}.headers.${pluralFeatureCamel}"),
        },
      ]}
      dataTable={
        <Update${featurePascal}Form ${featureCamel}={data.data} />
      }
      resourceName={data.data.name}
    />
  );
}
`;
}
