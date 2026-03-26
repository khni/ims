import { useUpdateRole } from "@/src/api";

import RoleFormDetails from "@/src/features/role/forms/RoleFormDetails";
import { GetRoleByIdResponse } from "@avuny/shared";
import React from "react";

export const UpdateRoleForm = ({ role }: { role: GetRoleByIdResponse }) => {
  const { mutateAsync, isPending, error } = useUpdateRole();
  return (
    <div>
      <RoleFormDetails
        role={role}
        customForm={{
          api: {
            onSubmit: async (data) => mutateAsync({ data: data, id: role.id }),
            isLoading: isPending,
          },
          error,
        }}
      />
    </div>
  );
};
