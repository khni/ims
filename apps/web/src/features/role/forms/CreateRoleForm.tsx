import { useCreateRole } from "@/src/api";
import RoleFormDetails from "@/src/features/role/forms/RoleFormDetails";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export const CreateRoleForm = () => {
  const queryClient = useQueryClient();
  const { isPending, error, mutateAsync } = useCreateRole();
  return (
    <div>
      <RoleFormDetails
        customForm={{
          api: {
            onSubmit: async (data) => await mutateAsync({ data }),
            isLoading: isPending,
          },
          error,
        }}
      />
    </div>
  );
};
