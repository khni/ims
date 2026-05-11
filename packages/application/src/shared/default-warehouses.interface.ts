import { Context } from "@avuny/core";
import { PrismaTransactionManager } from "@avuny/db";
export interface IDefaultWarehouseService {
  create(params: {
    context: Context;
    data: { organizationId: string };
    tx?: PrismaTransactionManager;
  }): Promise<{ id: string; name: string }[]>;
}
