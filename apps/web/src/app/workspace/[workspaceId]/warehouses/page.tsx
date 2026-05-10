"use client";

import {
  WarehouseDataTable,
  WarehouseFormButton,
} from "@/src/features/warehouse";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const warehouseHeadersT = useTranslations("warehouse.headers");

  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<WarehouseFormButton />}
      dataTable={<WarehouseDataTable />}
      resourceName={warehouseHeadersT("warehouses")}
    />
  );
}

export default Page;
