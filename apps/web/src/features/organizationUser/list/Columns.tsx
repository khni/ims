// Columns.tsx
"use client";
import type { OrganizationUserListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";
import { Messages } from "next-intl";

enum OrganizationUserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

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
      {
        key: "name",
        meta: { filterKey: "name", filterVariant: "text", showFilter: true },
        render: (_, row) => (
          <div className="flex flex-col">
            <div>{row.name}</div>
            <div className="text-muted-foreground">{row.user.email}</div>
          </div>
        ),
      },
      {
        key: "role",
        render: (_, row) => row.role.name,
        meta: {
          filterKey: "roleName",
          filterVariant: "text",
          showFilter: true,
        },
      },
      {
        key: "status",
        render: (_, row) => organizationUserStatusTranslations(row.status),
        meta: {
          filterOptions: Object.values(OrganizationUserStatus).map(
            (status) => ({
              label: organizationUserStatusTranslations(status),
              value: status,
            }),
          ),
          filterKey: "status",
          showFilter: true,
        },
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
