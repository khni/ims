// update-unit-form.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import { useUpdateUnit, getUnitListQueryKey } from "@/src/api";

import { updateUnitBodySchema as schema } from "@avuny/shared";
import { useUnitTranslations } from "@/src/features/unit/translations/hooks/use-unit-translations";

import { GetUnitByIdResponse } from "@avuny/shared";

export type UpdateUnitFormProps = {
  unit: GetUnitByIdResponse | null;
};

export const UpdateUnitForm: React.FC<UpdateUnitFormProps> = ({ unit }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (unit) {
      form.reset({
        name: unit.name ?? "",
        description: unit.description ?? "",
      });
    }
  }, [unit, form]);

  const { mutateAsync, isPending, error } = useUpdateUnit();
  const { unitFormFieldsTranslations } = useUnitTranslations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          if (!unit) return;
          await mutateAsync({
            id: unit.id,
            data,
          });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getUnitListQueryKey()}
      getLabel={unitFormFieldsTranslations}
      resourceName="unit"
      actionName="update"
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
