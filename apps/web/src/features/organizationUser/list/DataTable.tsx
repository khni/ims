// DataTable.tsx
"use client";
import React, { useState } from "react";
import {
  getOrganizationUserListQueryKey,
  useDeleteOrganizationUser,
  useOrganizationUserList,
} from "@/src/api";
import type { OrganizationUserFilters } from "@avuny/shared";
import { OrganizationUserColumns } from "./Columns";
import { useTranslations } from "next-intl";
import { SortingState } from "@tanstack/react-table";
import { useFilters } from "@/src/hooks/use-filters.hook";
import { mapSortingArray } from "@workspace/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import DataList from "@/src/components/data-list";

export const OrganizationUserDataTable: React.FC = () => {
  const organizationUserColumnHeaderTranslations = useTranslations(
    "organizationUser.columnHeaders",
  );
  const organizationUserStatusTranslations = useTranslations(
    "organizationUser.status",
  );
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "updatedAt", desc: false },
  ]);
  const { mutateAsync } = useDeleteOrganizationUser();

  const { filters, resetFilters, setFilters } =
    useFilters<OrganizationUserFilters>();

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const { data, isPending } = useOrganizationUserList({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters,
    orderBy: mapSortingArray(sortingState),
  });
  const queryClient = useQueryClient();

  enum OrganizationUserStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED",
  }
  return (
    <>
      <DataList
        resetFilters={resetFilters}
        searchKey="name"
        onRowClickConfig={{
          href: "organization-users",
          idKey: "id",
        }}
        filterConfigs={[
          {
            type: "checkbox",
            title: organizationUserColumnHeaderTranslations("status"),

            options: Object.values(OrganizationUserStatus).map((status) => ({
              label: organizationUserStatusTranslations(status),
              value: status,
            })),
            key: "status",
          },
          {
            type: "date",
            title: organizationUserColumnHeaderTranslations("updatedAt"),
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
        columns={OrganizationUserColumns({
          getHeader: organizationUserColumnHeaderTranslations,
          organizationUserStatusTranslations,
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
              queryKey: getOrganizationUserListQueryKey(),
            });
          },
        }}
      />
    </>
  );
};
