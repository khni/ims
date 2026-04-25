// update-unit-collection-form.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useUpdateUnitCollection,
  getUnitCollectionListQueryKey,
} from "@/src/api";

import { updateUnitCollectionBodySchema as schema } from "@avuny/shared";
import { useUnitCollectionTranslations } from "@/src/features/unit-collection/translations/hooks/use-unit-collection-translations";

import { GetUnitCollectionByIdResponse } from  "@avuny/shared";

export type UpdateUnitCollectionFormProps = {
  unitCollection: GetUnitCollectionByIdResponse | null;
};

export const UpdateUnitCollectionForm: React.FC<
  UpdateUnitCollectionFormProps
> = ({ unitCollection }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (unitCollection) {
      form.reset({
        name: unitCollection.name ?? "",
        description: unitCollection.description ?? "",
      });
    }
  }, [unitCollection, form]);

  const { mutateAsync, isPending, error } = useUpdateUnitCollection();
  const { unitCollectionFormFieldsTranslations } =
    useUnitCollectionTranslations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          if (!unitCollection) return;
          await mutateAsync({
            id: unitCollection.id,
            data,
          });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getUnitCollectionListQueryKey()}
      getLabel={unitCollectionFormFieldsTranslations}
      resourceName="unitCollection"
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
