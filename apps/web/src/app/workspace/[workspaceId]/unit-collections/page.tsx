"use client";

import {
  UnitCollectionDataTable,
  UnitCollectionFormButton,
} from "@/src/features/unit-collection";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const unitCollectionHeadersT = useTranslations("unitCollection.headers");

  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<UnitCollectionFormButton />}
      dataTable={<UnitCollectionDataTable />}
      resourceName={unitCollectionHeadersT("unitCollections")}
    />
  );
}

export default Page;
