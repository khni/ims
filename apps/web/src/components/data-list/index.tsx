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
import { Filters } from "@workspace/ui/blocks/data-table/filter";
import React from "react";

export interface DataListProps<TData, TValue>
  extends
    DataTableProps<TData, TValue>,
    Pick<FilterProps<string | number>, "filterConfigs"> {
  searchKey: string;
  onRowClickConfig?: { href: string; idKey: keyof TData };
}

function DataList<TData, TValue>({
  searchKey,
  filterConfigs,
  onRowClickConfig,
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
            setFilters({ [searchKey]: String(value) });
          }}
          placeholder="Search..."
          type={"text"}
          value={filters[searchKey] ? String(filters[searchKey]) : ""}
        />
        <FilterComponent
          resetFilters={resetFilters}
          filterConfigs={filterConfigs}
          onApply={(filters) => {
            setFilters(filters);
          }}
          filters={filters}
        />
      </div>
      <DataTable
        onRowClick={
          onRowClickConfig
            ? (row) =>
                router.push(
                  `${onRowClickConfig.href}/${row.original[onRowClickConfig.idKey]}`,
                )
            : undefined
        }
        {...props}
      />
    </div>
  );
}

export default DataList;
