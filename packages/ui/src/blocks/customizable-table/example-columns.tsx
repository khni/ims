import { ColumnDef } from "@tanstack/react-table";
import DATA, {
  status,
} from "@workspace/ui/blocks/customizable-table/example-data";
import createSelectCell from "@workspace/ui/blocks/data-table/create-select-cell";
import EditableCell from "@workspace/ui/blocks/data-table/editable-cell";
const SelectCell = createSelectCell(status);
export function DataColumnExample(): ColumnDef<(typeof DATA)[0]>[] {
  return [
    {
      accessorKey: "task",
      header: "Task",
      cell: EditableCell,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: SelectCell,
    },
    {
      accessorKey: "due",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate: (typeof DATA)[0]["due"] = row.getValue("due");
        return (
          <p>
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </p>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      size: 225,
      cell: EditableCell,
    },
  ];
}

export default DataColumnExample;
