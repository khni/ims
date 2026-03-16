"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { Select } from "@workspace/ui/components/select";
import {
  Control,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ErrorResponse } from "@khni/error-handler";
import { getFieldErrors } from "@workspace/ui/blocks/form/getFieldErrors";

interface Option {
  id: string;
  name: string | number;
}

interface SelectFormFieldProps<T extends FieldValues, E> {
  form?: UseFormReturn<T>;
  name: FieldPath<T>;
  setValue?: (value: string) => void;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  errorResponse?: ErrorResponse<E>;
}

const SelectFormField = <T extends FieldValues, E>({
  form,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled = false,
  setValue,
  errorResponse,
}: SelectFormFieldProps<T, E>) => {
  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem className=" flex-1">
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              setValue && setValue(value);
            }}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl className="md:min-w-[220px]">
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldErrors(name, errorResponse)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default SelectFormField;
