import { Context } from "@avuny/core";

import { OrganizationUserRepository } from "../repositories/organozation-user.repository.js";
import { IActivityLogService } from "../../shared.js";
import { IOwnerOrganizationUserService } from "../../shared/owner-oganization-user.interface.js";
import { PrismaTransactionManager } from "@avuny/db";

export class OwnerOrganizationUserService implements IOwnerOrganizationUserService {
  ownerName = "Owner";
  private organizationUserRepository: OrganizationUserRepository;
  private activityLog: IActivityLogService;

  constructor({
    organizationUserRepository,
    activityLog,
  }: {
    organizationUserRepository: OrganizationUserRepository;
    activityLog: IActivityLogService;
  }) {
    this.organizationUserRepository = organizationUserRepository;
    this.activityLog = activityLog;
  }

  create = async (params: {
    context: Context;
    data: { organizationId: string; userId: string; roleId: string };
    tx?: PrismaTransactionManager;
  }) => {
    const organizationUser =
      await this.organizationUserRepository.createTransaction(
        async (transaction) => {
          const tx = params.tx ?? transaction;
          const user = await this.organizationUserRepository.create({
            data: {
              name: this.ownerName,
              status: "ACTIVE",
              expiresAt: null,
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
              resourceType: "organizationUser",
            },
          });
          return user;
        },
      );

    return { id: organizationUser.id };
  };
}
