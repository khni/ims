// DataTable.tsx
"use client";
import React, { useState } from "react";
import { getRoleListQueryKey, useOrganizationUserList } from "@/src/api";
import type { OrganizationUserListResponse } from "@avuny/shared";
import { OrganizationUserColumns } from "./Columns";
import { DataTable } from "@workspace/ui/blocks/data-table/data-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SortingState } from "@tanstack/react-table";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";

export const OrganizationUserDataTable: React.FC = () => {
  const router = useRouter();
  const organizationUserColumnHeaderTranslations = useTranslations(
    "organizationUser.columnHeaders",
  );
  const organizationUserStatusTranslations = useTranslations(
    "organizationUser.status",
  );
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]); //this will be removed later when i make orderBy optional
  const [filter, setFilter] = React.useState({});

  const { filters, resetFilters, setFilters } = useFilters();

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const { data, isPending } = useOrganizationUserList({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters: filters,
    orderBy: mapSortingArray(sortingState),
  });
  console.log("filters:", filters);
  console.log("orderBy", mapSortingArray(sortingState));

  if (!data) return null;

  return (
    <DataTable
      columns={OrganizationUserColumns({
        getHeader: organizationUserColumnHeaderTranslations,
        organizationUserStatusTranslations,
      })}
      data={data.data.list}
      onRowClick={(row) => router.push(`organization-users/${row.original.id}`)}
      pagination={pagination}
      rowCount={data.data.totalCount}
      setPagination={setPagination}
      sorting={sortingState}
      onSortingChange={setSortingState}
      filters={filters}
      onFilterChange={(filters) => setFilters(filters)}
    />
  );
};
