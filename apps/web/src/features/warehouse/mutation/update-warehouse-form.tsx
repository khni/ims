// update-warehouse-form.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useUpdateWarehouse,
  getWarehouseListQueryKey,
} from "@/src/api";

import { updateWarehouseBodySchema as schema } from "@avuny/shared";
import { useWarehouseTranslations } from "@/src/features/warehouse/translations/hooks/use-warehouse-translations";

import { GetWarehouseByIdResponse } from  "@avuny/shared";

export type UpdateWarehouseFormProps = {
  warehouse: GetWarehouseByIdResponse | null;
};

export const UpdateWarehouseForm: React.FC<
  UpdateWarehouseFormProps
> = ({ warehouse }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (warehouse) {
      form.reset({
        name: warehouse.name ?? "",
        description: warehouse.description ?? "",
      });
    }
  }, [warehouse, form]);

  const { mutateAsync, isPending, error } = useUpdateWarehouse();
  const { warehouseFormFieldsTranslations } =
    useWarehouseTranslations();

  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          if (!warehouse) return;
          await mutateAsync({
            id: warehouse.id,
            data,
          });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getWarehouseListQueryKey()}
      getLabel={warehouseFormFieldsTranslations}
      resourceName="warehouse"
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
