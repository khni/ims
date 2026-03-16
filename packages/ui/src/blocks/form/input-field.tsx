import { ErrorResponse } from "@khni/error-handler";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { getFieldErrors } from "@workspace/ui/blocks/form/getFieldErrors";
import React from "react";

import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form";
export type InputFieldProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  errorResponse?: ErrorResponse<E>;
};

export const InputField = <T extends FieldValues, E = unknown>({
  form,
  name,
  label,
  type = "text",
  errorResponse,
}: InputFieldProps<T, E>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              disabled={form.formState.isSubmitting}
            />
          </FormControl>
          {getFieldErrors(name, errorResponse)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
