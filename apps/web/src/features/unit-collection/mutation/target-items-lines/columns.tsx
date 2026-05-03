import {
  GetUnitCollectionByIdResponse,
  UnitOptionsResponse,
} from "@avuny/shared";
import { ColumnDef } from "@tanstack/react-table";

import createSelectCell from "@workspace/ui/blocks/data-table/create-select-cell";
import EditableCell from "@workspace/ui/blocks/data-table/editable-cell";

export function TargetUnitColumns({
  units,
}: {
  units: UnitOptionsResponse;
}): ColumnDef<GetUnitCollectionByIdResponse["targetUnitLines"][0]>[] {
  const SelectCell = createSelectCell(units.list);
  return [
    {
      accessorKey: "targetUnit",
      header: "Target Unit",
      cell: SelectCell,
    },

    {
      accessorKey: "factor",
      header: "Factor",
      cell: EditableCell,
    },
  ];
}
