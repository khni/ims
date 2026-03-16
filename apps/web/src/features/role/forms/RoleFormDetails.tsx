"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as CustomForm, FormProps } from "@/src/components/form";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createRoleBodySchema } from "@avuny/shared";
import { z } from "@avuny/zod";
import { useTranslations } from "next-intl";
import { useCommonTranslations } from "@/messages/common";

import { useGetPermissionsMatrix } from "@/src/api";
import LoadingPage from "@workspace/ui/blocks/loading/loading-page";
import { ItemOptionMatrix } from "@workspace/ui/blocks/item-option-matrix";

import { useQueryClient } from "@tanstack/react-query";
import { GetRoleByIdResponse } from "@avuny/shared";
const schema = createRoleBodySchema;
export type RoleFormDetailsProps<E, S extends string> = {
  role?: GetRoleByIdResponse;
  customForm: Omit<FormProps<z.infer<typeof schema>, E, S>, "form" | "fields">;
};

export default function RoleFormDetails<E, S extends string>({
  role,
  customForm,
}: RoleFormDetailsProps<E, S>) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        ...role,
        permissions: role.rolePermissions ?? [],
      });
      setSelectedPermissions(role.rolePermissions ?? []);
    }
  }, [role, form]);
  const { data, isPending } = useGetPermissionsMatrix();

  const fieldTranslations = useTranslations("role.form.fields");

  const [selectedPermissions, setSelectedPermissions] = useState(
    role?.rolePermissions || [],
  );

  useEffect(() => {
    form.setValue("permissions", selectedPermissions, {
      shouldValidate: true,
    });
  }, [selectedPermissions, form]);
  const setPermissions = (
    permissions: GetRoleByIdResponse["rolePermissions"],
  ) => {
    setSelectedPermissions(permissions);
  };

  const originalOnSubmit = customForm.api.onSubmit;

  if (isPending) {
    return <LoadingPage />;
  }
  if (!data) {
    return "Error";
  }

  return (
    <>
      <CustomForm
        {...customForm}
        api={{
          ...customForm.api,
          onSubmit: async (data, event) => {
            await originalOnSubmit(
              {
                ...data,
                permissions: selectedPermissions,
              },
              event,
            );
            queryClient.invalidateQueries({
              queryKey: ["roleList"],
            });
          },
        }}
        form={form}
        getLabel={fieldTranslations}
        resourceName="role"
        actionName={role ? "update" : "create"}
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
        ]}
      >
        <ItemOptionMatrix
          resources={data.data.resources}
          actions={data.data.actions}
          permissions={data.data.permissions}
          selectedPermissions={selectedPermissions}
          onChange={setPermissions}
        />
      </CustomForm>
    </>
  );
}
