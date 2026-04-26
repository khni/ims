import { ColumnDef } from "@tanstack/react-table";
import DATA from "@workspace/ui/blocks/customizable-table/example-data";

export function DataColumnExample(): ColumnDef<(typeof DATA)[0]>[] {
  return [
    {
      accessorKey: "task",
      header: "Task",
      cell: ({ row }) => <p>{row.getValue("task")}</p>,
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => <p>{row.getValue("assignee")}</p>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: (typeof DATA)[0]["status"] = row.getValue("status");
        return <p>{status?.name}</p>;
      },
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
  ];
}

export default DataColumnExample;
