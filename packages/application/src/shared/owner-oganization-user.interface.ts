import { Context } from "@avuny/core";

export interface IOwnerOrganizationUserService {
  create: (params: {
    context: Context;
    data: {
      organizationId: string;
      userId: string;
      roleId: string;
    };
    tx?: unknown;
  }) => Promise<{
    id: string;
  }>;
}
