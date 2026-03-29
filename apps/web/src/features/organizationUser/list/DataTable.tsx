// DataTable.tsx
"use client";
import React from "react";
import { useOrganizationUserList } from "@/src/api";
import type { OrganizationUserListResponse } from "@avuny/shared";
import { OrganizationUserColumns } from "./Columns";
import { DataTable } from "@workspace/ui/blocks/data-table";
import { useTranslations } from "next-intl";

export const OrganizationUserDataTable: React.FC = () => {
  const organizationUserColumnHeaderTranslations = useTranslations(
    "organizationUser.columnHeaders",
  );
  const { data, isPending } = useOrganizationUserList({
    query: { queryKey: ["organizationUserList"] },
  });

  if (!data) return null;

  return (
    <DataTable
      columns={OrganizationUserColumns({
        getHeader: organizationUserColumnHeaderTranslations as (
          key: keyof OrganizationUserListResponse[number],
        ) => string,
      })}
      data={data.data.list}
    />
  );
};
