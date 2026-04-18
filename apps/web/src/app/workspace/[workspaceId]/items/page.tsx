"use client";

import {
  ItemDataTable,
  ItemFormButton,
} from "@/src/features/item";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const itemHeadersT = useTranslations("item.headers");

  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<ItemFormButton />}
      dataTable={<ItemDataTable />}
      resourceName={itemHeadersT("items")}
    />
  );
}

export default Page;
