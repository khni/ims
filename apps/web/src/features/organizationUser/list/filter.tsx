"use client";

import { useState } from "react";

import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Calendar } from "@workspace/ui/components/calendar";
export type Filters = {
  status: string[];
  roles: string[];
  fromDate?: Date;
  toDate?: Date;
};

const STATUS_OPTIONS = ["active", "inactive", "pending"];
const ROLE_OPTIONS = ["admin", "user", "manager"];

export default function FilterComponent({
  onApply,
}: {
  onApply: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    status: [],
    roles: [],
  });

  const toggleValue = (key: "status" | "roles", value: string) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4 space-y-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800">
          {/* Status */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
              Status
            </h4>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleValue("status", status)}
                  />
                  <Label htmlFor={status} className="capitalize">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
              Roles
            </h4>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((role) => (
                <div key={role} className="flex items-center gap-2">
                  <Checkbox
                    id={role}
                    checked={filters.roles.includes(role)}
                    onCheckedChange={() => toggleValue("roles", role)}
                  />
                  <Label htmlFor={role} className="capitalize">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
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
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              onClick={() =>
                setFilters({
                  status: [],
                  roles: [],
                  fromDate: undefined,
                  toDate: undefined,
                })
              }
            >
              Reset
            </Button>

            <Button onClick={() => onApply(filters)}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
