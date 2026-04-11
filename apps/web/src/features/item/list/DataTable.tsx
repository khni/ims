// DataTable.tsx
"use client";
import React from "react";
import { useItemList } from "@/src/api";
import type { ItemListResponse } from "@avuny/shared";
import { ItemColumns } from "./Columns";
import { DataTable } from "@workspace/ui/blocks/data-table";
import { useTranslations } from "next-intl";

export const ItemDataTable: React.FC = () => {
  const itemColumnHeaderTranslations = useTranslations("item.columnHeaders");
  const { data, isPending } = useItemList({
    query: { queryKey: ["itemList"] },
  });

  if (!data) return null;

  return (
    <DataTable
      columns={ItemColumns({
        getHeader: itemColumnHeaderTranslations as (key: keyof ItemListResponse[number]) => string,
      })}
      data={data.data.list}
      isLoading={isPending}
    />
  );
};
