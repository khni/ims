import { checkUnique, Context, IResourcePermission } from "@avuny/core";
import { IActivityLogService } from "../../shared.js";
import { OrganizationRepository } from "../repositories/organization.repository.js";
import {
  CreateOrganizationBody,
  GetOrganizationByIdParams,
  UpdateOrganizationBody,
} from "../types.js";
import { Tx } from "@avuny/db";
import { OrganizationErrorCode } from "../errors/errorCode.js";
import { creationLimitExceeded, fail, ok } from "@avuny/utils";

export type CreateOrganiationParams = {
  data: CreateOrganizationBody;
  context: Omit<Context, "organizationId">;
  ownerId: string;
  tx?: Tx;
};

export type UpdateOrganizationParams = {
  data: UpdateOrganizationBody;
  where: GetOrganizationByIdParams;
  context: Context;
  ownerId: string;
  tx?: Tx;
};
export class OrganizationMutationService {
  constructor(
    private organizationRepository: OrganizationRepository,
    private activityLogService: IActivityLogService,
    private resourcePermission: IResourcePermission,
    private creationLimit = 10,
  ) {}

  create = async (params: CreateOrganiationParams) => {
    const uniqueError = await checkUnique({
      data: { ...params.data, ownerId: params.ownerId },
      uniqueChecker: [
        {
          keys: ["name", "ownerId"],
          errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
        },
      ],
      context: params.context,
      repository: this.organizationRepository,
      config: {
        moduleName: "organization",
        action: "create",
      },
    });
    if (uniqueError) {
      return uniqueError;
    }
    const count = await this.organizationRepository.count({
      where: { ownerId: params.ownerId },
    });
    if (count >= this.creationLimit) {
      return creationLimitExceeded();
    }
    const organization = await this.organizationRepository.createTransaction(
      async (tx) => {
        const organization = await this.organizationRepository.create({
          data: { ...params.data, ownerId: params.ownerId },
          tx,
        });
        await this.activityLogService.create({
          data: {
            organizationId: organization.id,
            event: "create",
            resourceId: organization.id,
            resourceType: "organization",
          },
        });
        return organization;
      },
    );

    return ok(organization);
  };
  update = async (params: UpdateOrganizationParams) => {
    const uniqueError = await checkUnique({
      data: { ...params.data, ownerId: params.ownerId },
      uniqueChecker: [
        {
          keys: ["name", "ownerId"],
          errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
        },
      ],
      context: params.context,
      repository: this.organizationRepository,
      config: {
        moduleName: "organization",
        action: "update",
      },
    });
    if (uniqueError) {
      return uniqueError;
    }
  };
}
