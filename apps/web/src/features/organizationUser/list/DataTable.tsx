// DataTable.tsx
"use client";
import React from "react";
import { getRoleListQueryKey, useOrganizationUserList } from "@/src/api";
import type { OrganizationUserListResponse } from "@avuny/shared";
import { OrganizationUserColumns } from "./Columns";
import { DataTable } from "@workspace/ui/blocks/data-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const OrganizationUserDataTable: React.FC = () => {
  const router = useRouter();
  const organizationUserColumnHeaderTranslations = useTranslations(
    "organizationUser.columnHeaders",
  );
  const organizationUserStatusTranslations = useTranslations(
    "organizationUser.status",
  );
  const { data, isPending } = useOrganizationUserList();

  if (!data) return null;

  return (
    <DataTable
      columns={OrganizationUserColumns({
        getHeader: organizationUserColumnHeaderTranslations,
        organizationUserStatusTranslations,
      })}
      data={data.data.list}
      onRowClick={(row) => router.push(`organization-users/${row.original.id}`)}
    />
  );
};
