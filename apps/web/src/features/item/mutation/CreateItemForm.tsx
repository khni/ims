// CreateItemForm.tsx
"use client";
import React from "react";
import { useCreateItem } from "@/src/api";
import ItemDetailsForm from "./ItemDetailsForm";

export const CreateItemForm: React.FC = () => {
  const { mutateAsync, isPending, error } = useCreateItem();
  return (
    <div>
      <ItemDetailsForm
        customForm={{
          api: { onSubmit: async (data) => await mutateAsync({ data }), isLoading: isPending },
          error,
        }}
      />
    </div>
  );
};
