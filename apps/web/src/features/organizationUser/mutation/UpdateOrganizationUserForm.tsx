// UpdateOrganizationUserForm.tsx
"use client";

import { useUpdateOrganizationUser } from "@/src/api";
import { GetOrganizationUserByIdResponse } from "@avuny/shared";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";
import { updateOrganizationUserBodySchema as schema } from "@avuny/shared";
import { useOrganizationUserTranslations } from "@/src/features/organizationUser/translations/hooks/useOrganizationUserTranslations";

export type OrganizationUserFormDetailsProps = {
  organizationUser: GetOrganizationUserByIdResponse;
};

export default function OrganizationUserDetailsForm({
  organizationUser,
}: OrganizationUserFormDetailsProps) {
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
  const { mutateAsync, isPending, error } = useUpdateOrganizationUser();

  return (
    <CustomForm
      error={error}
      api={{
        onSubmit: async (data) =>
          mutateAsync({ data: data, id: organizationUser.id }),
        isLoading: isPending,
      }}
      form={form}
      getLabel={organizationUserFormFieldsTranslations}
      resourceName="organizationUser"
      actionName={"update"}
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
      ]}
    />
  );
}
