import { Context } from "../../../types";

export function listPageTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `"use client";

import {
  ${featurePascal}DataTable,
  ${featurePascal}FormButton,
} from "@/src/features/${kebabCase}";
import { ROUTES } from "@/src/features/routes";
import ListPageLayout from "@workspace/ui/blocks/list-page-layout";
import { useTranslations } from "next-intl";
import React from "react";

function Page() {
  const commonHeadersT = useTranslations("common.headers");
  const ${featureCamel}HeadersT = useTranslations("${featureCamel}.headers");

  return (
    <ListPageLayout
      breadCrumbItems={[
        { name: commonHeadersT("home"), href: ROUTES.app.index() },
      ]}
      createResourceButton={<${featurePascal}FormButton />}
      dataTable={<${featurePascal}DataTable />}
      resourceName={${featureCamel}HeadersT("${featureCamel}s")}
    />
  );
}

export default Page;
`;
}
