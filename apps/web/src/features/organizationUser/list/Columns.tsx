// Columns.tsx
"use client";
import type { OrganizationUserListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";
import { Messages } from "next-intl";
export const OrganizationUserColumns = ({
  getHeader,
  organizationUserStatusTranslations,
}: {
  getHeader: (
    value: keyof Messages["organizationUser"]["columnHeaders"],
  ) => string;
  organizationUserStatusTranslations: (
    value: keyof Messages["organizationUser"]["status"],
  ) => string;
}) =>
  createColumns<OrganizationUserListResponse[number]>({
    columns: [
      { key: "name" },
      { key: "role", render: (_, row) => row.role.name },
      { key: "user", render: (_, row) => row.user.email },
      {
        key: "status",
        render: (_, row) => organizationUserStatusTranslations(row.status),
      },
      {
        key: "updatedAt",
        render: (value) => new Date(value).toLocaleDateString(),
        meta: {
          filterKey: "updatedAt",
          filterVariant: "date",
          showFilter: true,
        },
      },
    ],
    getHeader,
  });
