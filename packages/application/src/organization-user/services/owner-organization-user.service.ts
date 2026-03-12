import { Context } from "@avuny/core";

import { OrganizationUserRepository } from "../repositories/organozation-user.repository.js";
import { IActivityLogService } from "../../shared.js";
import { IOwnerOrganizationUserService } from "../../shared/owner-oganization-user.interface.js";

export class OwnerOrganizationUserService implements IOwnerOrganizationUserService {
  ownerName = "Owner";
  constructor(
    private organizationUserRepository: OrganizationUserRepository,
    private activityLog: IActivityLogService,
  ) {}

  create = async (params: {
    context: Context;
    data: { organizationId: string; userId: string; roleId: string };
    tx?: unknown;
  }) => {
    const organizationUser =
      await this.organizationUserRepository.createTransaction(async (tx) => {
        const user = await tx.organizationUser.create({
          data: {
            name: this.ownerName,
            status: "ACTIVE",
            expiresAt: null,
            ...params.data,
          },
        });
        await this.activityLog.create({
          tx,
          data: {
            event: "create",
            organizationId: params.data.organizationId, // in case of organization creation, the organizationId is the record id
            resourceId: user.id,
            resourceType: "organizationUser",
          },
        });
        return user;
      });

    return { id: organizationUser.id };
  };
}
