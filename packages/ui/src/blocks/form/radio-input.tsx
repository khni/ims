"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Control,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { ErrorResponse } from "@khni/error-handler";
import { getFieldErrors } from "@workspace/ui/blocks/form/getFieldErrors";

interface Option {
  id: string;
  name: string | number;
}

interface RadioGroupFormFieldProps<T extends FieldValues, E> {
  form?: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: Option[];
  disabled?: boolean;
  setValue?: (value: string) => void;
  errorResponse?: ErrorResponse<E>;
}

const RadioGroupFormField = <T extends FieldValues, E>({
  form,
  name,
  label,
  options,
  disabled = false,
  setValue,
  errorResponse,
}: RadioGroupFormFieldProps<T, E>) => {
  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                setValue && setValue(value);
              }}
              defaultValue={field.value}
              disabled={disabled}
              className="flex flex-col gap-2"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {getFieldErrors(name, errorResponse)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioGroupFormField;
