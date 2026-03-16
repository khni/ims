"use client";
import {
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  Path,
} from "react-hook-form";

import { FC, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import React from "react";
import { Form } from "@workspace/ui/components/form";

import SubmitButton from "@workspace/ui/blocks/form/submit-button";

import {
  DynamicGridFields,
  DynamicGridFieldsProps,
} from "@workspace/ui/blocks/form/fields";

// ------------------
// Props
// ------------------
export type CustomFormProps<T extends FieldValues, E> = {
  cardTitle?: string;
  cardDescription?: string;

  submitButtonPosition?: "center" | "left" | "right" | "full";
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  api: { onSubmit: SubmitHandler<T>; isLoading: boolean };
  onSuccess?: (data: T) => void;
  footerContent?: ReactNode;
  className?: string;
  formClassName?: string;

  children: React.ReactNode;

  submitButtonText?: string;
  isLoadingText: string;
} & DynamicGridFieldsProps<T, E>;

// ------------------
// Component
// ------------------
const CustomForm = <T extends FieldValues, E>({
  form,
  fields,
  cardTitle = "Form",
  cardDescription = "",
  submitButtonText = "submit",
  submitButtonPosition = "full",
  submitButtonVariant = "default",

  footerContent,
  className,
  formClassName = "space-y-6",
  api,
  onSuccess,
  isLoadingText = "isLoading...",
  getLabel,

  children,
}: CustomFormProps<T, E>) => {
  const getButtonPositionClass = () => {
    switch (submitButtonPosition) {
      case "left":
        return "justify-start";
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      default:
        return "";
    }
  };
  const { isLoading, onSubmit } = api;
  const onSubmitHandler: SubmitHandler<T> = async (data) => {
    await onSubmit(data);
    onSuccess?.(data);
  };
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        {cardDescription && (
          <CardDescription>{cardDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className={formClassName}
          >
            <>
              {fields ? (
                <DynamicGridFields
                  form={form}
                  getLabel={getLabel}
                  fields={fields}
                />
              ) : null}
              {children}
            </>
            <div className={`flex ${getButtonPositionClass()} mt-6`}>
              <SubmitButton
                isLoading={isLoading}
                loadingText={isLoadingText}
                submitText={submitButtonText}
              />
            </div>

            {footerContent && <div className="mt-4">{footerContent}</div>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomForm;
