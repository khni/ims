"use client";

import { RoleDataTable, RoleFormButton } from "@/src/features/role";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const roleHeadersT = useTranslations("role.headers");
  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<RoleFormButton />}
      dataTable={<RoleDataTable />}
      resourceName={roleHeadersT("roles")}
    />
  );
}

export default Page;
