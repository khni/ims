import { Context } from "@avuny/core";
import { PrismaTransactionManager } from "@avuny/db";

export interface IOwnerRoleService {
  create: (params: {
    context: Context;
    data: {
      organizationId: string;
    };
    tx?: PrismaTransactionManager;
  }) => Promise<{
    id: string;
  }>;
}
