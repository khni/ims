// CreateOrganizationUserForm.tsx
"use client";
import React from "react";
import { useCreateOrganizationUser } from "@/src/api";
import OrganizationUserDetailsForm from "./OrganizationUserDetailsForm";

export const CreateOrganizationUserForm: React.FC = () => {
  const { mutateAsync, isPending, error } = useCreateOrganizationUser();
  return (
    <div>
      <OrganizationUserDetailsForm
        customForm={{
          api: { onSubmit: async (data) => await mutateAsync({ data }), isLoading: isPending },
          error,
        }}
      />
    </div>
  );
};
