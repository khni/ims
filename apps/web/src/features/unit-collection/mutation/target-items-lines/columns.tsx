import {
  GetUnitCollectionByIdResponse,
  UnitOptionsResponse,
} from "@avuny/shared";
import { ColumnDef } from "@tanstack/react-table";

import createSelectCell from "@workspace/ui/blocks/data-table/create-select-cell";
import { createColumns } from "@workspace/ui/blocks/data-table/custom-columns";
import EditableCell from "@workspace/ui/blocks/data-table/editable-cell";
import { Messages } from "next-intl";

export function TargetUnitColumns({
  units,
  getHeader,
}: {
  units: UnitOptionsResponse;
  getHeader: (
    value: keyof Messages["unitCollection"]["targetUnitLineColumnHeaders"],
  ) => string;
}): ColumnDef<GetUnitCollectionByIdResponse["targetUnitLines"][0]>[] {
  const SelectCell = createSelectCell(units.list);
  return [
    {
      accessorKey: "targetUnit",
      header: getHeader("targetUnit"),
      cell: SelectCell,
    },

    {
      accessorKey: "factor",
      header: getHeader("factor"),
      cell: EditableCell,
    },
  ];
}
