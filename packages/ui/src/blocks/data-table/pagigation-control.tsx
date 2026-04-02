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
    <div className="flex items-center justify-between gap-4 p-4 border-t dark:border-gray-700">
      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
          disabled={pagination.pageIndex === 0}
          aria-label="First Page"
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
          aria-label="Previous Page"
        >
          {"<"}
        </Button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {pagination.pageIndex + 1} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: prev.pageIndex + 1,
            }))
          }
          disabled={pagination.pageIndex + 1 >= totalPages}
          aria-label="Next Page"
        >
          {">"}
        </Button>
        <Button
          onClick={() =>
            setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }))
          }
          disabled={pagination.pageIndex + 1 >= totalPages}
          aria-label="Last Page"
        >
          {">>"}
        </Button>
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="pageSize"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Rows per page:
        </label>
        <select
          id="pageSize"
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

      {/* Total Rows Count */}
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Total: {rowCount} rows
      </div>
    </div>
  );
};

export default TablePagination;
