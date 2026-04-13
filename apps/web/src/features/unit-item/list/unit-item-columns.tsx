// unit-item-columns.tsx
"use client";

import { Messages } from "next-intl";
import type { UnitItemListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const UnitItemColumns = ({
  getHeader,
}: {
  getHeader: (
    value: keyof Messages["unitItem"]["columnHeaders"]
  ) => string;
}) =>
  createColumns<UnitItemListResponse[number]>({
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
