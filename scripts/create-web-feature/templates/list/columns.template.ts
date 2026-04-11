export function columnsTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: {
  featurePascal: string;
  featureCamel: string;
  kebabCase: string;
}) {
  return `// ${kebabCase}-columns.tsx
"use client";

import { Messages } from "next-intl";
import type { ${featurePascal}ListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const ${featurePascal}Columns = ({
  getHeader,
}: {
  getHeader: (
    value: keyof Messages["${featureCamel}"]["columnHeaders"]
  ) => string;
}) =>
  createColumns<${featurePascal}ListResponse[number]>({
    columns: [
      {
        key: "name",
        render: (_, row) => row.name,
      },
      {
        key: "description",
        render: (_, row) => row.description,
      },
      {
        key: "updatedAt",
        render: (value) =>
          new Date(value).toLocaleDateString(),
      },
    ],
    getHeader,
  });
`;
}
