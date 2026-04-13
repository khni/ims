// unit-item-data-table.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SortingState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import {
  useUnitItemList,
  useDeleteUnitItem,
  getUnitItemListQueryKey,
} from "@/src/api";

import type { UnitItemFilters } from "@avuny/shared";

import { UnitItemColumns } from "./unit-item-columns";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";
import DataList from "@/src/components/data-list";

export const UnitItemDataTable: React.FC = () => {
  const columnHeaderTranslations = useTranslations(
    "unitItem.columnHeaders"
  );

  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]);

  const { mutateAsync } = useDeleteUnitItem();

  const { filters, resetFilters, setFilters } =
    useFilters<UnitItemFilters>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = useUnitItemList({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters,
    orderBy: mapSortingArray(sortingState),
  });

  const queryClient = useQueryClient();

  return (
    <DataList
      resetFilters={resetFilters}
      searchKey="name"
      onRowClickConfig={{
        href: "unitItems",
        idKey: "id",
      }}
      filterConfigs={[
        {
          type: "date",
          title: columnHeaderTranslations("updatedAt"),
          key: "updatedAt",
          value: filters.updatedAt,
          onChange: (value) => {
            setFilters({
              updatedAt: value,
            });
          },
        },
      ]}
      isLoading={isPending}
      columns={UnitItemColumns({
        getHeader: columnHeaderTranslations,
      })}
      data={data?.data}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sortingState}
      onSortingChange={setSortingState}
      filters={filters}
      onFilterChange={(filters) => setFilters(filters)}
      dropdownActions={{
        onDelete: async (row) => {
          await mutateAsync({ id: row.original.id });

          queryClient.invalidateQueries({
            queryKey: getUnitItemListQueryKey(),
          });
        },
      }}
    />
  );
};
