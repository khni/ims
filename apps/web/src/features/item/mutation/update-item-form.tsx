// update-item-form.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useUpdateItem,
  getItemListQueryKey,
  useUnitCollectionList,
} from "@/src/api";

import { updateItemBodySchema as schema } from "@avuny/shared";
import { useItemTranslations } from "@/src/features/item/translations/hooks/use-item-translations";

import { GetItemByIdResponse } from "@avuny/shared";

export type UpdateItemFormProps = {
  item: GetItemByIdResponse | null;
};

export const UpdateItemForm: React.FC<UpdateItemFormProps> = ({ item }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      unitCollectionId: "",
      returnable: false,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name ?? "",
        description: item.description ?? "",
        unitCollectionId: item.unitCollectionId ?? "",

        returnable: item.returnable ?? false,
      });
    }
  }, [item, form]);

  const { mutateAsync, isPending, error } = useUpdateItem();
  const { itemFormFieldsTranslations } = useItemTranslations();
  const { data: unitCollectionsData, isPending: unitCollectionsIsPending } =
    useUnitCollectionList({
      filters: {},
      orderBy: {},
      page: 0,
      pageSize: 10,
    });
  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          if (!item) return;
          await mutateAsync({
            id: item.id,
            data,
          });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getItemListQueryKey()}
      getLabel={itemFormFieldsTranslations}
      resourceName="item"
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
        {
          key: "unitCollectionId",
          content: {
            name: "unitCollectionId",
            type: "select",
            options: unitCollectionsData?.data.list || [],
          },
          spans: { base: 4, md: 2 },
        },

        {
          key: "returnable",
          content: {
            name: "returnable",
            type: "checkbox",
            setValue: (value) => form.setValue("returnable", value),
          },
          spans: { base: 4, md: 2 },
        },
      ]}
    />
  );
};
