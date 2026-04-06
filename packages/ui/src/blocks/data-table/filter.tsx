"use client";

import { useState } from "react";

import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";

export type Filters<T> = {
  [key: string]: T[];
};

export default function FilterComponent<T extends string | number>({
  onApply,
  filterConfigs,
}: {
  onApply: (filters: Filters<T>) => void;
  filterConfigs: {
    type: "checkbox";
    options: { label: string; value: T }[];
    key: string;
    title?: string;
  }[];
}) {
  const [filters, setFilters] = useState<Filters<T>>({});

  const toggleValue = (key: string, value: T) => {
    setFilters((prev) => {
      const currentValues = prev[key] || [];
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
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
            {Object.keys(filters).length > 0 && (
              <span className="text-xs text-white bg-blue-500 rounded-full px-1">
                {Object.values(filters).reduce(
                  (sum, arr) => sum + arr.length,
                  0,
                )}
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
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                onClick={() => {
                  const next = Object.fromEntries(
                    Object.keys(filters).map((key) => [key, []]),
                  );
                  setFilters(next);
                  onApply(next);
                }}
              >
                Reset
              </Button>
            </div>

            <Separator />

            {/* Filter Sections */}
            <div className="space-y-5 max-h-75 overflow-y-auto pr-1">
              {filterConfigs.map((config) => (
                <div key={config.key} className="space-y-3">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {config.title || config.key}
                  </h4>

                  <div className="grid gap-2">
                    {config.type === "checkbox" &&
                      config.options.map((option) => {
                        const checked = filters[config.key]?.includes(
                          option.value,
                        );

                        return (
                          <label
                            key={String(option.value)}
                            htmlFor={String(option.value)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={String(option.value)}
                                checked={checked}
                                onCheckedChange={() =>
                                  toggleValue(config.key, option.value)
                                }
                              />
                              <span className="text-sm text-zinc-800 dark:text-zinc-200 capitalize">
                                {option.label}
                              </span>
                            </div>

                            {checked && (
                              <span className="text-xs text-primary font-medium">
                                Selected
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Footer Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = Object.fromEntries(
                    Object.keys(filters).map((key) => [key, []]),
                  );
                  setFilters(next);
                  onApply(next);
                }}
              >
                Clear
              </Button>

              {/* <Button size="sm" onClick={() => onApply(filters)}>
                Apply Filters
              </Button> */}
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
