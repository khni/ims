// warehouse-columns.tsx
"use client";

import { Messages } from "next-intl";
import type { WarehouseListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const WarehouseColumns = ({
  getHeader,
}: {
  getHeader: (
    value: keyof Messages["warehouse"]["columnHeaders"]
  ) => string;
}) =>
  createColumns<WarehouseListResponse[number]>({
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
