// Columns.tsx
"use client";
import type { ItemListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const ItemColumns = ({ getHeader }: { getHeader: any }) =>
  createColumns<ItemListResponse[number]>({
    columns: [{ key: "name" }, { key: "description" }],
    getHeader,
  });
