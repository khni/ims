"use client";

import { useRoleList } from "@/src/api";
import { RoleList200Data } from "@/src/api/model";
import { RoleColumns } from "@/src/features/role/list/columns";
import { DataTable } from "@workspace/ui/blocks/data-table";
import { useTranslations } from "next-intl";
export const RoleDataTable = () => {
  const roleColumnHeaderTranslations = useTranslations("role.columnHeaders");
  const { data, isPending } = useRoleList({
    query: {
      queryKey: ["roleList"],
    },
  });
  if (!data) {
    return null;
  }

  return (
    <DataTable
      columns={RoleColumns({
        getHeader: roleColumnHeaderTranslations as (
          key: keyof RoleList200Data["list"][number],
        ) => string,
      })}
      data={data.data.list}
    />
  );
};
