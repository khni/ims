// unit-data-table.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SortingState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import { useUnitList, useDeleteUnit, getUnitListQueryKey } from "@/src/api";

import type { UnitFilters } from "@avuny/shared";

import { UnitColumns } from "./unit-columns";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";
import DataList from "@/src/components/data-list";

export const UnitDataTable: React.FC = () => {
  const columnHeaderTranslations = useTranslations("unit.columnHeaders");

  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]);

  const { mutateAsync } = useDeleteUnit();

  const { filters, resetFilters, setFilters } = useFilters<UnitFilters>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = useUnitList({
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
        href: "units",
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
      columns={UnitColumns({
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
            queryKey: getUnitListQueryKey(),
          });
        },
      }}
    />
  );
};
