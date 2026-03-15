import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";
import { OrganizationRepository } from "../repositories/organization.repository.js";
import { OrganizationErrorCode } from "../errors/errorCode.js";
import { CreateOrganizationBody, UpdateOrganizationBody } from "../types.js";
import { IOwnerOrganizationUserService } from "../../shared/owner-oganization-user.interface.js";
import { IOwnerRoleService } from "../../shared/owner-role.interface.js";
export class OrganizationService {
  constructor(
    private organizationRepository: OrganizationRepository,
    private moduleService: ModuleService<OrganizationRepository>,
    private ownerOrganizationUserService: IOwnerOrganizationUserService,
    private ownerRoleService: IOwnerRoleService,
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
      countChecker: [
        {
          keys: ["ownerId"],
          errorKey: OrganizationErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
      hooks: {
        afterCreate: async ({ record, tx, context }) => {
          const role = await this.ownerRoleService.create({
            tx,
            context,
            data: {
              organizationId: record.id,
            },
          });
          console.log(role, "role");

          const user = await this.ownerOrganizationUserService.create({
            context,
            tx,
            data: {
              roleId: role.id,
              userId: context.userId,
              organizationId: record.id,
            },
          });
          console.log(user, "user");
        },
      },
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
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "ownerId"],
            errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          ownerId: params.context.userId,
          name: params.data.name,
        },
      },
    });
    return await updateOrganization({
      ...params,
      data: params.data,
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
    query?: FilteredPaginatedList<
      {
        name?: string;
      },
      { createdAt: "asc" | "desc" }
    >;
  }) => {
    const filteredPaginatedOrganizationList =
      this.moduleService.filteredPaginatedList();
    return await filteredPaginatedOrganizationList({
      ...params,
      query: {
        ...params.query,
        filters: { ...params.query?.filters, ownerId: params.context.userId },
      },
    });
  };
}
