// UpdateItemForm.tsx
"use client";
import React from "react";
import { useUpdateItem } from "@/src/api";
import { GetItemByIdResponse } from "@avuny/shared";
import ItemDetailsForm from "./ItemDetailsForm";

export const UpdateItemForm: React.FC<{ item: GetItemByIdResponse }> = ({ item }) => {
  const { mutateAsync, isPending, error } = useUpdateItem();

  return (
    <div>
      <ItemDetailsForm
        item={item}
        customForm={{
          api: { onSubmit: async (data) => mutateAsync({ data: data, id: item.id }), isLoading: isPending },
          error,
        }}
      />
    </div>
  );
};
