// create-unit-collection-form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useCreateUnitCollection,
  getUnitCollectionListQueryKey,
} from "@/src/api";

import { createUnitCollectionBodySchema as schema } from "@avuny/shared";
import { useUnitCollectionTranslations } from "@/src/features/unit-collection/translations/hooks/use-unit-collection-translations";

export const CreateUnitCollectionForm: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending, error } = useCreateUnitCollection();
  const { unitCollectionFormFieldsTranslations } =
    useUnitCollectionTranslations();

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
      queryInvalidateKey={getUnitCollectionListQueryKey()}
      getLabel={unitCollectionFormFieldsTranslations}
      resourceName="unitCollection"
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
