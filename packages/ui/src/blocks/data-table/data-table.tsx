"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  Row,
  SortingState,
  OnChangeFn,
  RowData,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import clsx from "clsx";

import TablePagination from "./pagigation-control";

import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from "lucide-react";
import { DatePickerWithRange } from "@workspace/ui/blocks/form/date-picker-range";
import { DebouncedInput } from "@workspace/ui/blocks/form/debounced-input";
import { Button } from "@workspace/ui/components/button";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey: string;
    filterVariant?: "text" | "number" | "date";
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
  setData?: React.Dispatch<React.SetStateAction<TData[]>>;
  onRowClick?: (row: Row<TData>) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  sorting?: SortingState;
  filters: any;
  onFilterChange: (dataFilters: any) => void;
  onSortingChange?: OnChangeFn<SortingState>;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  rowCount,
  setData,
  pagination,
  setPagination,
  sorting,
  onSortingChange,
  filters,
  onFilterChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    manualPagination: true,
    rowCount,
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      //...
      pagination,
      sorting,
    },
    manualSorting: true,
    onSortingChange,
    meta: {
      //   updateData: (rowIndex: number, columnId: string, value: string) => {
      //     setData((prev) =>
      //       prev.map((row, index) =>
      //         index === rowIndex ? { ...row, [columnId]: value } : row
      //       )
      //     );
      //   },
      //
    },
  });

  return (
    <div>
      <Table style={{ minWidth: `${table.getTotalSize()}px`, width: "100%" }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const fieldMeta = header.column.columnDef.meta;
                console.log("fieldMeta:", fieldMeta);
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: `${header.getSize()}px`,
                      position: "relative",
                    }}
                  >
                    {!header.isPlaceholder && (
                      <>
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2"
                              : "flex items-center gap-2"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {(() => {
                            const sortState = header.column.getIsSorted();
                            return sortState === "asc" ? (
                              <ArrowUpNarrowWide
                                className="cursor-pointer hover:bg-muted"
                                size={20}
                              />
                            ) : sortState === "desc" ? (
                              <ArrowDownNarrowWide
                                className="cursor-pointer hover:bg-muted"
                                size={20}
                              />
                            ) : (
                              <ArrowUpDown
                                className="cursor-pointer hover:bg-muted"
                                size={20}
                              />
                            );
                          })()}
                        </div>

                        {header.column.getCanFilter() &&
                          fieldMeta?.filterKey !== undefined &&
                          (fieldMeta.filterVariant === "date" ? (
                            <DatePickerWithRange
                              onChange={(value) => {
                                if (!value?.lte || !value.gte) {
                                  onFilterChange({
                                    [fieldMeta.filterKey]: undefined,
                                  });
                                  return;
                                }

                                onFilterChange({
                                  [fieldMeta.filterKey]: value,
                                });
                              }}
                              value={filters[fieldMeta.filterKey]}
                            />
                          ) : header.column.getCanFilter() &&
                            fieldMeta?.filterKey !== undefined &&
                            (fieldMeta.filterVariant === "text" ||
                              fieldMeta.filterVariant === "number") ? (
                            <DebouncedInput
                              className="w-36 border shadow rounded"
                              onChange={(value) => {
                                onFilterChange({
                                  [fieldMeta.filterKey]: value,
                                });
                              }}
                              placeholder="Search..."
                              type={
                                fieldMeta.filterVariant === "number"
                                  ? "number"
                                  : "text"
                              }
                              value={filters[fieldMeta.filterKey] ?? ""}
                            />
                          ) : (
                            <Button variant="ghost"></Button>
                          ))}
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick && onRowClick(row)}
                className={clsx({ "cursor-pointer": !!onRowClick })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: `${cell.column.getSize()}px` }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                List is empty.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        pagination={pagination}
        rowCount={rowCount}
        setPagination={setPagination}
      />
    </div>
  );
}

export default DataTable;
