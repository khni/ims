// unit-columns.tsx
"use client";

import { Messages } from "next-intl";
import type { UnitListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const UnitColumns = ({
  getHeader,
}: {
  getHeader: (
    value: keyof Messages["unit"]["columnHeaders"]
  ) => string;
}) =>
  createColumns<UnitListResponse[number]>({
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
