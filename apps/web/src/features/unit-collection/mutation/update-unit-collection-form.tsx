// update-unit-collection-form.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useUpdateUnitCollection,
  getUnitCollectionListQueryKey,
  useUnitList,
} from "@/src/api";

import { updateUnitCollectionBodySchema as schema } from "@avuny/shared";
import { useUnitCollectionTranslations } from "@/src/features/unit-collection/translations/hooks/use-unit-collection-translations";

import { GetUnitCollectionByIdResponse } from "@avuny/shared";
import TargetItemLines from "@/src/features/unit-collection/mutation/target-items-lines";

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
      baseUnitId: "",
    },
  });

  useEffect(() => {
    if (unitCollection) {
      form.reset({
        name: unitCollection.name ?? "",
        description: unitCollection.description ?? "",
        baseUnitId: unitCollection.baseUnitId ?? "",
      });
    }
  }, [unitCollection, form]);

  const { mutateAsync, isPending, error } = useUpdateUnitCollection();
  const { unitCollectionFormFieldsTranslations } =
    useUnitCollectionTranslations();
  const { data: unitsData, isPending: unitsIsPending } = useUnitList({
    filters: {},
    orderBy: {},
    page: 0,
    pageSize: 10,
  });
  const [targetUnitLines, setTargetUnitLines] = useState<
    GetUnitCollectionByIdResponse["targetUnitLines"]
  >(unitCollection?.targetUnitLines || []);
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
        {
          key: "baseUnitId",
          content: {
            name: "baseUnitId",
            type: "select",
            options: unitsData?.data.list || [],
          },
          spans: { base: 4, md: 2 },
        },
      ]}
    >
      <TargetItemLines
        targetUnits={targetUnitLines}
        setTargetUnits={setTargetUnitLines}
      ></TargetItemLines>
    </CustomForm>
  );
};
