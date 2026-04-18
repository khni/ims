// item-columns.tsx
"use client";

import { Messages } from "next-intl";
import type { ItemListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const ItemColumns = ({
  getHeader,
}: {
  getHeader: (
    value: keyof Messages["item"]["columnHeaders"]
  ) => string;
}) =>
  createColumns<ItemListResponse[number]>({
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
