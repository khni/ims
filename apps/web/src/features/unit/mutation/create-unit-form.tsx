// create-unit-form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import { useCreateUnit, getUnitListQueryKey } from "@/src/api";

import { createUnitBodySchema as schema } from "@avuny/shared";
import { useUnitTranslations } from "@/src/features/unit/translations/hooks/use-unit-translations";

export const CreateUnitForm: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending, error } = useCreateUnit();
  const { unitFormFieldsTranslations } = useUnitTranslations();

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
      queryInvalidateKey={getUnitListQueryKey()}
      getLabel={unitFormFieldsTranslations}
      resourceName="unit"
      actionName="create"
      fields={[
        {
          key: "name",
          content: { name: "name", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "symbol",
          content: { name: "symbol", type: "text" },
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
