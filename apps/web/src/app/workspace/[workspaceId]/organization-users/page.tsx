"use client";

import {
  OrganizationUserDataTable,
  OrganizationUserFormButton,
} from "@/src/features/organizationUser";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const organizationUserHeadersT = useTranslations("organizationUser.headers");
  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<OrganizationUserFormButton />}
      dataTable={<OrganizationUserDataTable />}
      resourceName={organizationUserHeadersT("organizationUsers")}
    />
  );
}

export default Page;
