"use client";

import {
  UnitDataTable,
  UnitFormButton,
} from "@/src/features/unit";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const unitHeadersT = useTranslations("unit.headers");

  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<UnitFormButton />}
      dataTable={<UnitDataTable />}
      resourceName={unitHeadersT("units")}
    />
  );
}

export default Page;
