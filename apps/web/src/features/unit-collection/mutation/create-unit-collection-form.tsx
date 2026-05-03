// create-unit-collection-form.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";

import { Form as CustomForm } from "@/src/components/form";
import {
  useCreateUnitCollection,
  getUnitCollectionListQueryKey,
  useUnitList,
  unitOptions,
  useUnitOptions,
} from "@/src/api";

import {
  GetUnitCollectionByIdResponse,
  createUnitCollectionBodySchema as schema,
} from "@avuny/shared";
import { useUnitCollectionTranslations } from "@/src/features/unit-collection/translations/hooks/use-unit-collection-translations";
import TargetItemLines from "@/src/features/unit-collection/mutation/target-items-lines";

export const CreateUnitCollectionForm: React.FC = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      baseUnitId: "",
      targetUnitLines: [],
    },
  });

  const { mutateAsync, isPending, error } = useCreateUnitCollection();
  const { unitCollectionFormFieldsTranslations } =
    useUnitCollectionTranslations();

  const { data: unitsData, isPending: unitsIsPending } = useUnitOptions({});
  const [targetUnitLines, setTargetUnitLines] = useState<
    GetUnitCollectionByIdResponse["targetUnitLines"]
  >([]);
  console.log(targetUnitLines, "targetUnitLines");
  return (
    <CustomForm
      form={form}
      error={error}
      api={{
        onSubmit: async (data) => {
          await mutateAsync({ data: { ...data, targetUnitLines } });
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
        setTargetUnits={setTargetUnitLines}
        targetUnits={targetUnitLines}
      ></TargetItemLines>
    </CustomForm>
  );
};
