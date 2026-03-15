"use client";

import { RoleDataTable, RoleFormButton } from "@/src/features/role";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import React from "react";

function Page() {
  return (
    <ListPageLayout
      breadCrumbItems={[{ name: "home", href: ROUTES.app.index() }]}
      createResourceButton={<RoleFormButton />}
      dataTable={<RoleDataTable />}
      resourceName="Role List"
    />
  );
}

export default Page;
