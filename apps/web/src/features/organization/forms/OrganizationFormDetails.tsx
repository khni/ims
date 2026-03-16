"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { mutateOrganizationSchema } from "@avuny/shared";
import { z } from "@avuny/zod";
import { useTranslations } from "next-intl";
import { useCommonTranslations } from "@/messages/common";
const schema = mutateOrganizationSchema.extend({ countryId: z.uuid() });
export type OrganizationFormDetailsProps<E, S extends string> = {
  organization?: z.infer<typeof schema>;
  customForm: Omit<FormProps<z.infer<typeof schema>, E, S>, "form" | "fields">;
  states: { id: string; name: string }[];
  countries: { id: string; name: string }[];
  setCountryId: (value: string) => void;
};

export default function OrganizationFormDetails<E, S extends string>({
  organization,
  customForm,
  countries,
  setCountryId,
  states,
}: OrganizationFormDetailsProps<E, S>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      inventoryStartDate: new Date().toISOString(),
    },
  });
  useEffect(() => {
    if (organization) {
      form.reset({
        ...organization,
      });
    }
  }, [organization, form]);
  const { actionTranslations } = useCommonTranslations();
  const fieldTranslations = useTranslations("organization.form.fields");
  const cardTitleTranslation = useTranslations("organization.form");
  return (
    <CustomForm
      form={form}
      getLabel={fieldTranslations}
      resourceName="organization"
      actionName={organization ? "update" : "create"}
      fields={[
        {
          key: "name",
          content: {
            name: "name",
            type: "text",
          },

          spans: {
            base: 4,
            md: 2,
          },
        },
        {
          key: "description",
          content: {
            name: "description",
            type: "text",
          },

          spans: {
            base: 4,
            md: 2,
          },
        },
        {
          key: "countryId",
          content: {
            name: "countryId",
            type: "select",
            options: countries,
            setValue: setCountryId,
          },

          spans: {
            base: 2,
            md: 2,
          },
        },
        {
          key: "stateId",
          content: {
            name: "stateId",
            type: "select",
            options: states,
          },

          spans: {
            base: 2,
            md: 2,
          },
        },
        {
          key: "inventoryDate",
          content: {
            name: "inventoryStartDate",
            type: "date",
          },

          spans: {
            base: 2,
            md: 2,
          },
        },
      ]}
      {...customForm}
    ></CustomForm>
  );
}
