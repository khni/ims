import React from "react";
export type Action = {
  id: string;
  name: string;
};

export type Resource = {
  id: string;
  name: string;
};

export type Permission = {
  id: string;
  actionId: string;
  resourceId: string;
};

export type SelectedPermission = {
  id: string;
  permissionId: string;
};

type ItemOptionMatrixProps<T extends SelectedPermission> = {
  resources: Resource[];
  actions: Action[];
  permissions: Permission[];
  selectedPermissions: T[];

  onChange: (next: T[]) => void;
};

export const ItemOptionMatrix = <T extends SelectedPermission>({
  resources,
  actions,
  permissions,
  selectedPermissions,
  onChange,
}: ItemOptionMatrixProps<T>) => {
  const selectedPermissionIds = new Set(
    selectedPermissions.map((sp) => sp.permissionId),
  );

  const togglePermission = (permissionId: string) => {
    const exists = selectedPermissionIds.has(permissionId);

    if (exists) {
      onChange(
        selectedPermissions.filter((sp) => sp.permissionId !== permissionId),
      );
    } else {
      onChange([
        ...selectedPermissions,
        {
          id: crypto.randomUUID(),
          permissionId,
        } as T, // assert this is T
      ]);
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div key={resource.id} className="space-y-2">
          <div className="font-medium">{resource.name}</div>

          <div className="flex gap-4 pl-4">
            {actions.map((action) => {
              const permission = permissions.find(
                (p) => p.resourceId === resource.id && p.actionId === action.id,
              );

              if (!permission) return null;

              const checked = selectedPermissionIds.has(permission.id);

              return (
                <label
                  key={action.id}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePermission(permission.id)}
                  />
                  <span>{action.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
