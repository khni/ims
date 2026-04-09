import { useFilters } from "@/src/hooks/use-filters.hook";
import {
  DataTable,
  DataTableProps,
} from "@workspace/ui/blocks/data-table/data-table";
import FilterComponent, {
  FilterProps,
} from "@workspace/ui/blocks/data-table/filter";
import { DebouncedInput } from "@workspace/ui/blocks/form/debounced-input";
import { buttonVariants } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

import React from "react";

export type DataListProps<TData extends { id: string }, TValue> = {
  searchKey: string;
  onRowClickPath?: string;
} & DataTableProps<TData, TValue> &
  Pick<FilterProps<string | number>, "filterConfigs">;
function DataList<
  TData extends { id: string },
  TValue,
  Filters extends Record<string, string | object | undefined>,
  F,
>({
  searchKey,
  filterConfigs,
  onRowClickPath,
  ...props
}: DataListProps<TData, TValue>) {
  const { filters, resetFilters, setFilters } = useFilters<Filters>();
  const router = useRouter();
  return (
    <div>
      <div className="flex gap-3">
        <DebouncedInput
          className={buttonVariants()}
          onChange={(value) => {
            setFilters({ [searchKey]: String(value) } as Partial<Filters>);
          }}
          placeholder="Search..."
          type={"text"}
          value={filters[searchKey] ? String(filters[searchKey]) : ""}
        />
        <FilterComponent
          filterConfigs={filterConfigs}
          onApply={(filters) => {
            setFilters(filters as Partial<Filters>);
          }}
          filters={filters}
        />
      </div>
      <DataTable
        onRowClick={
          onRowClickPath
            ? (row) => router.push(`${onRowClickPath}/${row.original.id}`)
            : undefined
        }
        {...props}
      />
    </div>
  );
}

export default DataList;
