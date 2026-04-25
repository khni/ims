// unit-collection-data-table.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SortingState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import {
  useUnitCollectionList,
  useDeleteUnitCollection,
  getUnitCollectionListQueryKey,
} from "@/src/api";

import type { UnitCollectionFilters } from "@avuny/shared";

import { UnitCollectionColumns } from "./unit-collection-columns";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";
import DataList from "@/src/components/data-list";

export const UnitCollectionDataTable: React.FC = () => {
  const columnHeaderTranslations = useTranslations(
    "unitCollection.columnHeaders"
  );

  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]);

  const { mutateAsync } = useDeleteUnitCollection();

  const { filters, resetFilters, setFilters } =
    useFilters<UnitCollectionFilters>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending } = useUnitCollectionList({
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
        href: "unit-collections",
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
      columns={UnitCollectionColumns({
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
            queryKey: getUnitCollectionListQueryKey(),
          });
        },
      }}
    />
  );
};
