"use client";

import { ColumnDef, RowData } from "@tanstack/react-table";
import React from "react";

type CellRenderFn<T> = (value: any, row: T) => React.ReactNode;
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey: string;
    filterVariant?: "text" | "number" | "date";
  }
}
interface CustomColumn<T> {
  key: keyof T;

  wrapperElement?: React.ElementType;
  render?: CellRenderFn<T>;
}
export interface CreateColumnsProps<T> {
  columns: (CustomColumn<T> & {
    meta?: { filterVariant?: "text" | "number" | "date"; filterKey: string };
  })[];
  getHeader: (key: keyof T) => string;
}

export function createColumns<T extends object>({
  columns,
  getHeader,
}: CreateColumnsProps<T>): ColumnDef<T>[] {
  return columns.map((col) => ({
    accessorKey: col.key as string,
    header: getHeader(col.key),
    cell: ({ row }) => {
      const value = row.getValue(col.key as string);

      const Wrapper = col.wrapperElement ?? "div";

      if (col.render) {
        return <Wrapper>{col.render(value, row.original)}</Wrapper>;
      }

      return <Wrapper>{String(value ?? "")}</Wrapper>;
    },
    meta: {
      filterKey: col.meta?.filterKey || (col.key as string),
      filterVariant: col.meta?.filterVariant || "text",
    },
  }));
}
