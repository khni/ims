"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";

type BackendDateRange = {
  gte: Date; //startDate Greater than or equal to startDate
  lte?: Date; //endDate Less than or equal to endDate
};

export function DatePickerWithRange({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: BackendDateRange | undefined;
  onChange?: (value: BackendDateRange | undefined) => void;
}) {
  // Keep internal date state in sync with `value` prop
  // When the parent clears or updates `value`, this ensures the UI reflects it
  // (since useState does not re-run on prop changes)
  useEffect(() => {
    setDate(convertToCalenderDateRange(value));
  }, [value]);

  const convertToBackendDateRange = (
    dateRange: DateRange | undefined,
  ): BackendDateRange | undefined => {
    if (dateRange?.from && dateRange?.to) {
      // Convert Cairo local dates to UTC date ranges
      const gte = new Date(
        Date.UTC(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate(),
        ),
      );

      const lte = new Date(
        Date.UTC(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate() + 1,
        ) - 1, // End of day in UTC
      );

      return { gte, lte };
    }
    return undefined;
  };
  const convertToCalenderDateRange = (
    dateRange: BackendDateRange | undefined,
  ): DateRange | undefined => {
    if (dateRange?.lte && dateRange?.gte) {
      return {
        from: dateRange.gte,
        to: dateRange.lte,
      };
    }
    return undefined;
  };
  const [date, setDate] = React.useState<DateRange | undefined>(
    convertToCalenderDateRange(value),
  );

  const onSelect = (value: DateRange | undefined) => {
    setDate(value);
    // if (value?.from && value?.to) {
    // Only update when both from & to are selected
    console.log("Selected Range:", value);
    onChange?.(convertToBackendDateRange(value));
    // }
  };

  return (
    <div className={cn("grid ", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              " my-3 flex h-7 gap-2  bg-secondary rounded-md border border-input px-3 py-2 text-sm transition duration-300 ease-in-out transform ring-2 ring-offset-background focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon size={20} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
