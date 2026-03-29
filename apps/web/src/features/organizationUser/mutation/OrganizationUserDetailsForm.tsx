// OrganizationUserDetailsForm.tsx
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";
import { mutateOrganizationUserSchema as schema } from "@avuny/shared";
import { useOrganizationUserTranslations } from "@/src/features/organizationUser/translations/hooks/useOrganizationUserTranslations";

export type OrganizationUserFormDetailsProps<E, S extends string> = {
  organizationUser?: z.infer<typeof schema>;
  customForm: Omit<FormProps<z.infer<typeof schema>, E, S>, "form" | "fields">;
};

export default function OrganizationUserDetailsForm<E, S extends string>({
  organizationUser,
  customForm,
}: OrganizationUserFormDetailsProps<E, S>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (organizationUser) form.reset(organizationUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationUser]);

  const { organizationUserFormFieldsTranslations } =
    useOrganizationUserTranslations();

  return (
    <CustomForm
      form={form}
      getLabel={organizationUserFormFieldsTranslations}
      resourceName="organizationUser"
      actionName={organizationUser ? "update" : "create"}
      fields={[
        {
          key: "name",
          content: { name: "name", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "roleId",
          content: { name: "roleId", type: "select", options: [] },
          spans: { base: 4, md: 2 },
        },
        {
          key: "identifier",
          content: { name: "identifier", type: "text" },
          spans: { base: 4, md: 2 },
        },
      ]}
      {...customForm}
    />
  );
}
