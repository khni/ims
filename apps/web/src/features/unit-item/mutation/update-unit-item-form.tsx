// update-unit-item-form.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useUpdateUnitItem,
  getUnitItemListQueryKey,
} from "@/src/api";

import { updateUnitItemSchema as schema } from "@avuny/shared";
import { useUnitItemTranslations } from "@/src/features/unit-item/translations/hooks/use-unit-item-translations";

import { GetUnitItemByIdResponse } from "@/src/api";

export type UpdateUnitItemFormProps = {
  unitItem: GetUnitItemByIdResponse | null;
};

export const UpdateUnitItemForm: React.FC<
  UpdateUnitItemFormProps
> = ({ unitItem }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (unitItem) {
      form.reset({
        name: unitItem.name ?? "",
        description: unitItem.description ?? "",
      });
    }
  }, [unitItem, form]);

  const { mutateAsync, isPending, error } = useUpdateUnitItem();
  const { unitItemFormFieldsTranslations } =
    useUnitItemTranslations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          if (!unitItem) return;
          await mutateAsync({
            id: unitItem.id,
            data,
          });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getUnitItemListQueryKey()}
      getLabel={unitItemFormFieldsTranslations}
      resourceName="unitItem"
      actionName="update"
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
