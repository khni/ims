"use client";

import { RoleList200Data } from "@/src/api/model";
import {
  CreateColumnsProps,
  createColumns,
} from "@workspace/ui/blocks/data-table/custom-columns";

export const RoleColumns = ({
  getHeader,
}: Pick<CreateColumnsProps<RoleList200Data["list"][number]>, "getHeader">) => {
  return createColumns<RoleList200Data["list"][number]>({
    columns: [
      {
        key: "name",
      },
      {
        key: "description",
      },
    ],
    getHeader,
  });
};
