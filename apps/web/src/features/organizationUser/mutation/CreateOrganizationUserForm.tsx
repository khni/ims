"use client";

import {
  getOrganizationUserListQueryKey,
  useCreateOrganizationUser,
  useRoleList,
} from "@/src/api";
import { GetOrganizationUserByIdResponse } from "@avuny/shared";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@avuny/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";
import { createOrganizationUserBodySchema as schema } from "@avuny/shared";
import { useOrganizationUserTranslations } from "@/src/features/organizationUser/translations/hooks/useOrganizationUserTranslations";

export type CreateOrganizationUserFormProps = {
  organizationUser: GetOrganizationUserByIdResponse;
};

export default function CreateOrganizationUserForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      name: "",
      roleId: "",
      expiresAt: null,
    },
  });

  const { organizationUserFormFieldsTranslations } =
    useOrganizationUserTranslations();
  const { mutateAsync, isPending, error } = useCreateOrganizationUser();

  // <WIP> this will be changed to role labels
  const { data: roleList } = useRoleList();

  return (
    <CustomForm
      error={error}
      api={{
        onSubmit: async (data) => {
          await mutateAsync({ data: data });
        },
        isLoading: isPending,
      }}
      queryInvalidateKey={getOrganizationUserListQueryKey()}
      form={form}
      getLabel={organizationUserFormFieldsTranslations}
      resourceName="organizationUser"
      actionName={"create"}
      fields={[
        {
          key: "identifier",
          content: { name: "identifier", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "name",
          content: { name: "name", type: "text" },
          spans: { base: 4, md: 2 },
        },
        {
          key: "roleId",
          content: {
            name: "roleId",
            type: "select",
            options: roleList?.data.list || [],
          },
          spans: { base: 4, md: 2 },
        },
      ]}
    />
  );
}
