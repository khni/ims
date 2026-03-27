import { Context } from "@avuny/core";

import { RoleRepository } from "../repositories/role.repository.js";
import { IActivityLogService } from "../../shared.js";
import { IOwnerRoleService } from "../../shared/owner-role.interface.js";
import { PrismaTransactionManager } from "@avuny/db";

export class OwnerRoleService implements IOwnerRoleService {
  ownerName = "Owner";
  private roleRepository: RoleRepository;
  private activityLog: IActivityLogService;

  constructor({
    roleRepository,
    activityLog,
  }: {
    roleRepository: RoleRepository;
    activityLog: IActivityLogService;
  }) {
    this.roleRepository = roleRepository;
    this.activityLog = activityLog;
  }

  create = async (params: {
    context: Context;
    data: { organizationId: string };
    tx?: PrismaTransactionManager;
  }) => {
    const role = await this.roleRepository.createTransaction(
      async (transaction) => {
        const tx = params.tx ?? transaction;
        const user = await this.roleRepository.create({
          data: {
            name: this.ownerName,
            customPermissions: [{ code: "FULL_ACCESS" }],
            permissions: [],
            ...params.data,
          },
          tx,
        });
        await this.activityLog.create({
          tx,
          data: {
            event: "create",
            organizationId: params.data.organizationId,
            resourceId: user.id,
            resourceType: "role",
          },
        });
        return user;
      },
    );

    return { id: role.id };
  };
}
