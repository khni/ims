import { GetUnitCollectionByIdResponse } from "@avuny/shared";
import { ColumnDef } from "@tanstack/react-table";
import DATA, {
  status,
} from "@workspace/ui/blocks/customizable-table/example-data";
import createSelectCell from "@workspace/ui/blocks/data-table/create-select-cell";
import EditableCell from "@workspace/ui/blocks/data-table/editable-cell";
const SelectCell = createSelectCell(status);
export function TargetUnitColumns(): ColumnDef<
  GetUnitCollectionByIdResponse["targetUnitLines"][0]
>[] {
  return [
    {
      accessorKey: "targetUnitId",
      header: "Target Unit",
      cell: EditableCell,
    },

    {
      accessorKey: "factor",
      header: "Factor",
      cell: SelectCell,
    },
  ];
}
