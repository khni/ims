import { Context, CreateService } from "@avuny/core";
import { OrganizationRepository } from "../repositories/organization.repository.js";
import { OrganizationErrorCode } from "../errors/errorCode.js";
import { CreateOrganizationBody } from "../types.js";

export class OrganizationService {
  constructor(
    private createService: CreateService,
    private organizationRepository: OrganizationRepository,
  ) {}
  create = async (params: {
    context: Context;
    data: CreateOrganizationBody;
    tx?: unknown;
  }) => {
    /// here we can add any organization specific logic before creating an organization.
    const createOrganization = this.createService.create({
      config: {
        creationLimit: 10,
        moduleName: "organization",
      },
      repository: this.organizationRepository,
      uniqueChecker: [
        {
          keys: ["name", "ownerId"],
          errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
        },
      ],
    });
    return await createOrganization({
      ...params,
      data: { ...params.data, ownerId: params.context.userId },
    });
  };
}
