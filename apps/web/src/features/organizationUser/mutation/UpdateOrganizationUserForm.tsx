// UpdateOrganizationUserForm.tsx
"use client";
import React from "react";
import { useUpdateOrganizationUser } from "@/src/api";
import { GetOrganizationUserByIdResponse } from "@avuny/shared";
import OrganizationUserDetailsForm from "./OrganizationUserDetailsForm";

export const UpdateOrganizationUserForm: React.FC<{
  organizationUser: GetOrganizationUserByIdResponse;
}> = ({ organizationUser }) => {
  const { mutateAsync, isPending, error } = useUpdateOrganizationUser();

  return (
    <div>
      {/* <OrganizationUserDetailsForm
        organizationUser={organizationUser}
        customForm={{
          api: { onSubmit: async (data) => mutateAsync({ data: data, id: organizationUser.id }), isLoading: isPending },
          error,
        }}
      /> */}
    </div>
  );
};
