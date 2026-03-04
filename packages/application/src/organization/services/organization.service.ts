import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";
import { OrganizationRepository } from "../repositories/organization.repository.js";
import { OrganizationErrorCode } from "../errors/errorCode.js";
import { CreateOrganizationBody, UpdateOrganizationBody } from "../types.js";

export class OrganizationModuleService {
  constructor(
    private organizationRepository: OrganizationRepository,
    private moduleService: ModuleService<OrganizationRepository>,
  ) {
    this.moduleService.setConfig({
      repository: this.organizationRepository,
      creationLimit: 10,
      moduleName: "organization",
    });
  }

  // ===============================
  // UPDATE
  // ===============================
  create = async (params: {
    context: Context;
    data: CreateOrganizationBody;
    tx?: unknown;
  }) => {
    /// here we can add any organization specific logic before creating an organization.
    const createOrganization = this.moduleService.create({
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

  // ===============================
  // UPDATE
  // ===============================
  update = async (params: {
    context: Context;
    data: UpdateOrganizationBody;
    id: string;
    tx?: unknown;
  }) => {
    /// here we can add any organization specific logic before updating an organization.
    const updateOrganization = this.moduleService.update({
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

  // ===============================
  // FIND BY ID
  // ===============================

  findById = async (params: { context: Context; id: string }) => {
    const getOrganizationById = this.moduleService.findById();
    return await getOrganizationById(params);
  };
  // ===============================
  // FILTERED PAGINATED LIST
  // ===============================
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
      this.moduleService.filteredPaginatedList();
    return await filteredPaginatedOrganizationList({ ...params });
  };
}
