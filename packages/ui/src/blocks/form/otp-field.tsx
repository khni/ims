import { ErrorResponse } from "@khni/error-handler";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { getFieldErrors } from "@workspace/ui/blocks/form/getFieldErrors";
import React from "react";

import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form";
export type InputFieldProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  errorResponse?: ErrorResponse<E>;
};

export const OtpField = <T extends FieldValues, E>({
  form,
  name,
  label,
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
            <InputOTP
              maxLength={6}
              {...field}
              disabled={form.formState.isSubmitting}
              className="flex space-x-2"
            >
              <InputOTPGroup dir="ltr" className="flex space-x-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {getFieldErrors(name, errorResponse)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OtpField;
