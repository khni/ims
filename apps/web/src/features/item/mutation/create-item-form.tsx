// create-item-form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import { useCreateItem, getItemListQueryKey } from "@/src/api";

import { createItemBodySchema as schema } from "@avuny/shared";
import { useItemTranslations } from "@/src/features/item/translations/hooks/use-item-translations";

export const CreateItemForm: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      purchasePrice: 0,
      salesPrice: 0,
      unit: "",
      returnable: false,
    },
  });

  const { mutateAsync, isPending, error } = useCreateItem();
  const { itemFormFieldsTranslations } = useItemTranslations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          console.log("Submitting data:", data);
          await mutateAsync({ data });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getItemListQueryKey()}
      getLabel={itemFormFieldsTranslations}
      resourceName="item"
      actionName="create"
      fields={[
        {
          key: "name",
          content: { name: "name", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "description",
          content: { name: "description", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "purchasePrice ",
          content: { name: "purchasePrice", type: "number" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "salesPrice",
          content: { name: "salesPrice", type: "number" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "unit",
          content: { name: "unit", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "returnable",
          content: { name: "returnable", type: "checkbox" },
          spans: { base: 4, md: 2 },
        },
      ]}
    />
  );
};
