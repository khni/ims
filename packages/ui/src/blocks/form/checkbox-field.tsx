"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { ErrorResponse } from "@khni/error-handler";
import { getFieldErrors } from "@workspace/ui/blocks/form/getFieldErrors";

interface CheckboxFormFieldProps<T extends FieldValues, E> {
  form?: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
  setValue?: (value: boolean) => void;
  errorResponse?: ErrorResponse<E>;
}

const CheckboxFormField = <T extends FieldValues, E>({
  form,
  name,
  label,
  disabled = false,
  setValue,
  errorResponse,
}: CheckboxFormFieldProps<T, E>) => {
  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex justify-center items-center gap-2">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(checked) => {
                const value = Boolean(checked);
                field.onChange(value);
                setValue && setValue(value);
              }}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel className="mt-0!">{label}</FormLabel>

          {getFieldErrors(name, errorResponse)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxFormField;
