// unit-collection-columns.tsx
"use client";

import { Messages } from "next-intl";
import type { UnitCollectionListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const UnitCollectionColumns = ({
  getHeader,
}: {
  getHeader: (
    value: keyof Messages["unitCollection"]["columnHeaders"],
  ) => string;
}) =>
  createColumns<UnitCollectionListResponse[number]>({
    columns: [
      {
        key: "name",
        render: (_, row) => row.name,
      },

      {
        key: "updatedAt",
        render: (value) => new Date(value).toLocaleDateString(),
      },
    ],
    getHeader,
  });
