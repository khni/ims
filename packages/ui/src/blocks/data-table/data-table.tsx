"use client";

import React from "react";
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
import Loading from "@workspace/ui/blocks/loading/loading";
import { Skeleton } from "@workspace/ui/components/skeleton";
import FilterComponent from "@workspace/ui/blocks/data-table/filter";
import {
  CustomDropdownMenu,
  CustomDropdownMenuProps,
} from "@workspace/ui/blocks/menus/custom-dropdown-menu";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey: string;
    filterVariant?: "text" | "number" | "date";
    showFilter?: boolean;

    // uses column value type
    filterOptions?: { label: string; value: TValue }[];

    hideOnMobile?: boolean;
  }
}
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  data?: {
    list: TData[];
    totalCount: number;
    set?: React.Dispatch<React.SetStateAction<TData[]>>;
  };
  dropdownActions?: {
    onDelete?: (row: Row<TData>) => Promise<void>;
    onEdit?: (row: Row<TData>) => Promise<void>;
  } & Omit<CustomDropdownMenuProps, "onDelete" | "onEdit">;

  onRowClick?: (row: Row<TData>) => void;

  pagination?: {
    pageIndex: number;
    pageSize: number;
  };

  sorting?: SortingState;
  filter?: {
    filters?: any;
    resetFilters: () => void;
    onFilterChange: (dataFilters: any) => void;
  };
  onSortingChange?: OnChangeFn<SortingState>;

  setPagination?: React.Dispatch<
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
  pagination,
  setPagination,
  sorting,
  onSortingChange,
  filter,
  isLoading,
  dropdownActions,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data?.list || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    manualPagination: true,
    rowCount: data?.totalCount || 0,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
    },
    manualSorting: true,
    onSortingChange,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        data?.set?.((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...row,
                  [columnId]: value,
                }
              : row,
          ),
        );
      },
    },
  });

  return (
    <div className="w-full">
      {/* ✅ Scroll wrapper */}
      <div className="w-full overflow-x-auto">
        <Table
          className="min-w-max"
          style={{ minWidth: `${table.getTotalSize()}px` }}
        >
          {/* HEADER */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;

                  return (
                    <TableHead
                      key={header.id}
                      className={clsx(
                        "p-2 text-xs sm:text-sm",
                        meta?.hideOnMobile && "hidden sm:table-cell",
                      )}
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                    >
                      {!header.isPlaceholder && (
                        <div className="flex flex-col gap-2">
                          {/* Sortable header */}
                          <div
                            className={clsx(
                              "flex items-center gap-2",
                              header.column.getCanSort() &&
                                "cursor-pointer select-none",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                            {onSortingChange &&
                              (() => {
                                const sortState = header.column.getIsSorted();
                                return sortState === "asc" ? (
                                  <ArrowUpNarrowWide size={16} />
                                ) : sortState === "desc" ? (
                                  <ArrowDownNarrowWide size={16} />
                                ) : (
                                  <ArrowUpDown size={16} />
                                );
                              })()}
                          </div>

                          {/* Filters */}
                          {filter &&
                          meta?.showFilter &&
                          header.column.getCanFilter() &&
                          meta?.filterKey ? (
                            meta.filterVariant === "date" ? (
                              <DatePickerWithRange
                                onChange={(value) => {
                                  if (!value?.lte || !value.gte) {
                                    filter.onFilterChange({
                                      [meta.filterKey]: undefined,
                                    });
                                    return;
                                  }

                                  filter.onFilterChange({
                                    [meta.filterKey]: value,
                                  });
                                }}
                                value={filter.filters[meta.filterKey]}
                              />
                            ) : meta.filterOptions ? (
                              <div>
                                <FilterComponent
                                  resetFilters={filter.resetFilters}
                                  filters={filter.filters}
                                  onApply={(newFilters) =>
                                    filter.onFilterChange({
                                      ...filter.filters,
                                      ...newFilters,
                                    })
                                  }
                                  filterConfigs={[
                                    {
                                      type: "checkbox",
                                      options: meta.filterOptions as {
                                        label: string;
                                        value: string;
                                      }[],
                                      key: meta.filterKey,
                                      title: header.column.columnDef
                                        .header as string,
                                    },
                                  ]}
                                />
                              </div>
                            ) : (
                              <DebouncedInput
                                className="w-full sm:w-36 border shadow rounded text-xs"
                                onChange={(value) =>
                                  filter.onFilterChange({
                                    [meta.filterKey]: value,
                                  })
                                }
                                placeholder="Search..."
                                type={
                                  meta.filterVariant === "number"
                                    ? "number"
                                    : "text"
                                }
                                value={filter.filters[meta.filterKey] ?? ""}
                              />
                            )
                          ) : (
                            <Button variant="ghost" className="h-6 w-full" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* BODY */}
          {isLoading ? (
            <TableBody>
              {Array.from({ length: pagination?.pageSize || 5 }).map(
                (_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {table.getAllLeafColumns().map((column, colIndex) => {
                      const meta = column.columnDef.meta;

                      return (
                        <TableCell
                          key={`skeleton-cell-${colIndex}`}
                          className={clsx(
                            "p-2",
                            meta?.hideOnMobile && "hidden sm:table-cell",
                          )}
                          style={{
                            width: `${column.getSize()}px`,
                          }}
                        >
                          <Skeleton
                            className={clsx(
                              "h-4 rounded",
                              colIndex % 3 === 0
                                ? "w-[60%]"
                                : colIndex % 3 === 1
                                  ? "w-[80%]"
                                  : "w-[40%]",
                            )}
                          />
                          <Skeleton
                            className={clsx(
                              "h-4 rounded ",
                              colIndex % 3 === 0
                                ? "w-[60%]"
                                : colIndex % 3 === 1
                                  ? "w-[80%]"
                                  : "w-[40%]",
                            )}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ),
              )}
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;

                        // Ignore clicks from interactive elements
                        if (
                          target.closest(
                            "button, a, input, textarea, [role='menuitem'], [data-interactive]",
                          )
                        ) {
                          return;
                        }

                        onRowClick?.(row);
                      }}
                      className={clsx({
                        "cursor-pointer": !!onRowClick,
                      })}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta;
                        return (
                          <TableCell
                            key={cell.id}
                            className={clsx(
                              "p-2 text-xs sm:text-sm whitespace-nowrap",
                              meta?.hideOnMobile && "hidden sm:table-cell",
                            )}
                            style={{
                              width: `${cell.column.getSize()}px`,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                      {dropdownActions && (
                        <TableCell
                          className={clsx(
                            "p-2 text-xs sm:text-sm whitespace-nowrap w-6",
                          )}
                        >
                          <CustomDropdownMenu
                            onDelete={
                              dropdownActions.onDelete
                                ? () => dropdownActions.onDelete!(row)
                                : undefined
                            }
                            onEdit={
                              dropdownActions.onEdit
                                ? () => dropdownActions.onEdit!(row)
                                : undefined
                            }
                            actionTranslations={
                              dropdownActions.actionTranslations
                            }
                            msgTranslations={dropdownActions.msgTranslations}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    List is empty.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* PAGINATION */}
      {setPagination && data?.totalCount && pagination && (
        <TablePagination
          pagination={pagination}
          rowCount={isLoading ? 0 : data?.totalCount || 0}
          setPagination={setPagination}
        />
      )}
    </div>
  );
}

export default DataTable;
