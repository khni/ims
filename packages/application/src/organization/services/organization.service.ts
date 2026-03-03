import {
  Context,
  CreateService,
  FilteredPaginatedList,
  ModuleService,
  QueryService,
  UpdateService,
} from "@avuny/core";
import { OrganizationRepository } from "../repositories/organization.repository.js";
import { OrganizationErrorCode } from "../errors/errorCode.js";
import { CreateOrganizationBody, UpdateOrganizationBody } from "../types.js";

export class OrganizationService {
  constructor(
    private createService: CreateService,
    private updateService: UpdateService,
    private queryService: QueryService,
    private organizationRepository: OrganizationRepository,
  ) {}
  moduleName = "organization" as const;
  create = async (params: {
    context: Context;
    data: CreateOrganizationBody;
    tx?: unknown;
  }) => {
    /// here we can add any organization specific logic before creating an organization.
    const createOrganization = this.createService.create({
      config: {
        creationLimit: 10,
        moduleName: this.moduleName,
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

  update = async (params: {
    context: Context;
    data: UpdateOrganizationBody;
    id: string;
    tx?: unknown;
  }) => {
    /// here we can add any organization specific logic before updating an organization.
    const updateOrganization = this.updateService.update({
      config: {
        moduleName: this.moduleName,
      },
      repository: this.organizationRepository,
      uniqueChecker: [
        {
          keys: ["name", "ownerId"],
          errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
        },
      ],
    });
    return await updateOrganization({
      ...params,
      data: { ...params.data, ownerId: params.context.userId },
    });
  };

  getById = async (params: { context: Context; id: string }) => {
    const getOrganizationById = this.queryService.findById({
      config: {
        moduleName: this.moduleName,
      },
      repository: this.organizationRepository,
    });
    return await getOrganizationById(params);
  };

  filteredPaginatedList = async (params: {
    context: Context;
    query: FilteredPaginatedList<
      {
        name?: string;
      },
      { createdAt: "asc" | "desc" }
    >;
  }) => {
    const filteredPaginatedOrganizationList =
      this.queryService.filteredPaginatedList({
        config: {
          moduleName: this.moduleName,
        },
        repository: this.organizationRepository,
      });
    return await filteredPaginatedOrganizationList({ ...params });
  };
}

class OrganizationModuleService extends ModuleService<OrganizationRepository> {
  constructor(
    createService: CreateService,
    updateService: UpdateService,
    queryService: QueryService,
    repository: OrganizationRepository,
  ) {
    super(createService, updateService, queryService);

    this.setConfig({
      repository,
      creationLimit: 10,
      moduleName: "organization",
    });
  }

  createOrg = async (params: {
    context: Context;
    data: CreateOrganizationBody;
    tx?: unknown;
  }) => {
    /// here we can add any organization specific logic before creating an organization.
    const createOrganization = this.create({
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
