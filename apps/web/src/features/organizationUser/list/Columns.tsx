// Columns.tsx
"use client";
import type { OrganizationUserListResponse } from "@avuny/shared";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";

export const OrganizationUserColumns = ({ getHeader }: { getHeader: any }) =>
  createColumns<OrganizationUserListResponse[number]>({
    columns: [{ key: "name" }, { key: "updatedAt" }],
    getHeader,
  });
