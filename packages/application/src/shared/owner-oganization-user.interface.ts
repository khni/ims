import { Context } from "@avuny/core";
import { PrismaTransactionManager } from "@avuny/db";

export interface IOwnerOrganizationUserService {
  create: (params: {
    context: Context;
    data: {
      organizationId: string;
      userId: string;
      roleId: string;
    };
    tx?: PrismaTransactionManager;
  }) => Promise<{
    id: string;
  }>;
}
