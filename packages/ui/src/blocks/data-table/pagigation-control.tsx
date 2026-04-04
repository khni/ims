import { Button } from "@workspace/ui/components/button";
import React from "react";

interface TablePaginationProps {
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  rowCount: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  setPagination,
  rowCount,
}) => {
  const totalPages = Math.ceil(rowCount / pagination.pageSize) || 1;

  return (
    <div
      className="flex flex-col gap-3 p-4 border-t dark:border-gray-700 
                    sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Navigation */}
      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
          disabled={pagination.pageIndex === 0}
        >
          {"<<"}
        </Button>

        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: prev.pageIndex - 1,
            }))
          }
          disabled={pagination.pageIndex === 0}
        >
          {"<"}
        </Button>

        <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Page {pagination.pageIndex + 1} / {totalPages}
        </span>

        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: prev.pageIndex + 1,
            }))
          }
          disabled={pagination.pageIndex + 1 >= totalPages}
        >
          {">"}
        </Button>

        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: totalPages - 1,
            }))
          }
          disabled={pagination.pageIndex + 1 >= totalPages}
        >
          {">>"}
        </Button>
      </div>

      {/* Page Size */}
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Rows:
        </label>
        <select
          className="border rounded-md p-1 text-sm dark:bg-gray-800 dark:text-gray-300"
          value={pagination.pageSize}
          onChange={(e) =>
            setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })
          }
        >
          {[5, 10, 15].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="text-center sm:text-right text-sm text-gray-700 dark:text-gray-300">
        Total: {rowCount}
      </div>
    </div>
  );
};

export default TablePagination;
