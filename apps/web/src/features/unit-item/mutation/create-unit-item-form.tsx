// create-unit-item-form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useCreateUnitItem,
  getUnitItemListQueryKey,
} from "@/src/api";

import { createUnitItemSchema as schema } from "@avuny/shared";
import { useUnitItemTranslations } from "@/src/features/unit-item/translations/hooks/use-unit-item-translations";

export const CreateUnitItemForm: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending, error } = useCreateUnitItem();
  const { unitItemFormFieldsTranslations } =
    useUnitItemTranslations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          await mutateAsync({ data });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getUnitItemListQueryKey()}
      getLabel={unitItemFormFieldsTranslations}
      resourceName="unitItem"
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
      ]}
    />
  );
};
