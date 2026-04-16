import { Context } from "@avuny/core";

import { RoleRepository } from "../repositories/role.repository.js";
import { IActivityLogService } from "../../../shared.js";
import { IOwnerRoleService } from "../../../shared/owner-role.interface.js";
import { PrismaTransactionManager } from "@avuny/db";
import { RoleConfig } from "../role.config.js";

export class OwnerRoleService implements IOwnerRoleService {
  private roleConfig: RoleConfig;
  private roleRepository: RoleRepository;
  private activityLog: IActivityLogService;

  constructor({
    roleRepository,
    activityLog,
    roleConfig,
  }: {
    roleRepository: RoleRepository;
    activityLog: IActivityLogService;
    roleConfig: RoleConfig;
  }) {
    this.roleRepository = roleRepository;
    this.activityLog = activityLog;
    this.roleConfig = roleConfig;
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
            name: this.roleConfig.ownerName,
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
