// warehouse-data-table.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SortingState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import {
  useWarehouseList,
  useDeleteWarehouse,
  getWarehouseListQueryKey,
} from "@/src/api";

import type { WarehouseFilters } from "@avuny/shared";

import { WarehouseColumns } from "./warehouse-columns";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";
import DataList from "@/src/components/data-list";

export const WarehouseDataTable: React.FC = () => {
  const columnHeaderTranslations = useTranslations(
    "warehouse.columnHeaders"
  );

  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]);

  const { mutateAsync } = useDeleteWarehouse();

  const { filters, resetFilters, setFilters } =
    useFilters<WarehouseFilters>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = useWarehouseList({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters,
    orderBy: mapSortingArray(sortingState),
  });

  const queryClient = useQueryClient();

  return (
    <DataList
      filter={{
        resetFilters,
        onFilterChange: (filters) => setFilters(filters),
        filters,
      }}
      searchKey="name"
      onRowClickConfig={{
        href: "warehouses",
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
      columns={WarehouseColumns({
        getHeader: columnHeaderTranslations,
      })}
      data={data?.data}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sortingState}
      onSortingChange={setSortingState}
      dropdownActions={{
        onDelete: async (row) => {
          await mutateAsync({ id: row.original.id });

          queryClient.invalidateQueries({
            queryKey: getWarehouseListQueryKey(),
          });
        },
      }}
    />
  );
};
