"use client";

import { useState } from "react";

import { Filter } from "lucide-react";
import { DatePickerWithRange } from "@workspace/ui/blocks/form/date-picker-range";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Separator } from "@workspace/ui/components/separator";
import { se } from "date-fns/locale";

export interface BackendDateRange {
  gte: Date;
  lte?: Date;
}

export type Filters = Record<string, string | [string] | object | undefined>;

export type FilterProps<T> = {
  onApply: (filters: Filters) => void;
  filters: Filters;
  resetFilters: () => void;
  filterConfigs: (
    | {
        type: "checkbox";
        options: { label: string; value: T }[];
        key: string;
        title?: string;
      }
    | {
        type: "date";
        value?: BackendDateRange;
        onChange?: (value: BackendDateRange | undefined) => void;
        key: string;
        title?: string;
      }
  )[];
};

export default function FilterComponent<T extends string | number>({
  onApply,
  filterConfigs,
  filters: initialFilters,
  resetFilters,
}: FilterProps<T>) {
  const [filters, setFilters] = useState<Filters>(initialFilters || {});

  const toggleValue = (key: string, value: T) => {
    setFilters((prev) => {
      const currentValues = (prev[key] as T[]) || [];
      const exists = currentValues.includes(value);

      const next = {
        ...prev,
        [key]: exists
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };

      onApply(next);
      return next;
    });
  };

  const getTotalSelected = () => {
    return Object.values(filters).reduce((sum, val) => {
      if (Array.isArray(val)) {
        return sum + val.length; // count each item in array
      }

      if (val && typeof val === "object") {
        return sum + 1; // count object as 1
      }

      return sum;
    }, 0);
  };
  console.log(filters, "filters from filter.tsx");
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
            {getTotalSelected() > 0 && (
              <span className="text-xs text-white bg-blue-500 rounded-full px-1">
                {getTotalSelected()}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-5 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Filters
              </h3>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  resetFilters();
                  setFilters({});
                }}
              >
                Reset
              </Button>
            </div>

            <Separator />

            {/* Filters */}
            <div className="space-y-5 max-h-75 overflow-y-auto pr-1">
              {filterConfigs.map((config) => (
                <div key={config.key} className="space-y-3">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {config.title || config.key}
                  </h4>

                  <div className="grid gap-2">
                    {config.type === "checkbox" &&
                      config.options.map((option) => {
                        const values = (filters[config.key] as T[]) || [];
                        const checked = values.includes(option.value);

                        return (
                          <label
                            key={String(option.value)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() =>
                                  toggleValue(config.key, option.value)
                                }
                              />
                              <span className="text-sm capitalize">
                                {option.label}
                              </span>
                            </div>

                            {checked && (
                              <span className="text-xs text-primary">
                                Selected
                              </span>
                            )}
                          </label>
                        );
                      })}

                    {config.type === "date" && (
                      <DatePickerWithRange
                        value={
                          filters[config.key] as BackendDateRange | undefined
                        }
                        onChange={(value) => {
                          const next = {
                            ...filters,
                            [config.key]: value,
                          };
                          setFilters(next);
                          onApply(next);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Footer */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetFilters();
                  setFilters({});
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

{
  /* Date Range */
}
{
  /* <div>
            <h4 className="text-sm font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
              Created At
            </h4>

            <div className="flex flex-col gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fromDate
                      ? format(filters.fromDate, "PPP")
                      : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.fromDate}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, fromDate: date }))
                    }
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.toDate ? format(filters.toDate, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.toDate}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, toDate: date }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div> */
}
