import { Context } from "@avuny/core";

export interface IOwnerRoleService {
  create: (params: {
    context: Context;
    data: {
      organizationId: string;
    };
    tx?: unknown;
  }) => Promise<{
    id: string;
  }>;
}
