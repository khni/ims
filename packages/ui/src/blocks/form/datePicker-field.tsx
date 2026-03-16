"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ErrorResponse } from "@khni/error-handler";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { getFieldErrors } from "@workspace/ui/blocks/form/getFieldErrors";
import { cn } from "@workspace/ui/lib/utils";

import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type DatePickerFieldProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  errorResponse?: ErrorResponse<E>;
  dateFormat?: string;
};

export const DatePickerField = <T extends FieldValues, E = unknown>({
  form,
  name,
  label,
  placeholder = "Pick a date",
  errorResponse,
  dateFormat = "PPP",
}: DatePickerFieldProps<T, E>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, dateFormat)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date?.toISOString());
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {getFieldErrors(name, errorResponse)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
