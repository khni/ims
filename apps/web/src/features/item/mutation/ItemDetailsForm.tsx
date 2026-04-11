// ItemDetailsForm.tsx
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";
import { mutateItemSchema as schema } from "@avuny/shared";
import { useItemTranslations } from "@/src/features/item/translations/hooks/useItemTranslations";

export type ItemFormDetailsProps<E, S extends string> = {
  item?: z.infer<typeof schema>;
  customForm: Omit<FormProps<z.infer<typeof schema>, E, S>, "form" | "fields">;
};

export default function ItemDetailsForm<E, S extends string>({
  item,
  customForm,
}: ItemFormDetailsProps<E, S>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (item) form.reset(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const { itemFormFieldsTranslations } = useItemTranslations();

  return (
    <CustomForm
      form={form}
      getLabel={itemFormFieldsTranslations}
      resourceName="item"
      actionName={item ? "update" : "create"}
      fields={[
        { key: "name", content: { name: "name", type: "text" }, spans: { base: 4, md: 2 } },
        { key: "description", content: { name: "description", type: "text" }, spans: { base: 4, md: 2 } },
      ]}
      {...customForm}
    />
  );
}
