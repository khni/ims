// create-warehouse-form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useCreateWarehouse,
  getWarehouseListQueryKey,
} from "@/src/api";

import { createWarehouseBodySchema as schema } from "@avuny/shared";
import { useWarehouseTranslations } from "@/src/features/warehouse/translations/hooks/use-warehouse-translations";

export const CreateWarehouseForm: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending, error } = useCreateWarehouse();
  const { warehouseFormFieldsTranslations } =
    useWarehouseTranslations();

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
      queryInvalidateKey={getWarehouseListQueryKey()}
      getLabel={warehouseFormFieldsTranslations}
      resourceName="warehouse"
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
