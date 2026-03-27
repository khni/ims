import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";

import { RoleErrorCode } from "../errors/errorCode.js";
import { CreateRoleBody, UpdateRoleBody } from "../types.js";
import { RoleRepository } from "../repositories/role.repository.js";

export class RoleService {
  private roleRepository: RoleRepository;
  private moduleService: ModuleService<RoleRepository>;

  constructor({
    roleRepository,
    moduleService,
  }: {
    roleRepository: RoleRepository;
    moduleService: ModuleService<RoleRepository>;
  }) {
    this.roleRepository = roleRepository;
    this.moduleService = moduleService;

    this.moduleService.setConfig({
      repository: this.roleRepository,
      creationLimit: 10,
      moduleName: "role",
    });
  }

  // ===============================
  // UPDATE
  // ===============================
  create = async (params: {
    context: Context;
    data: CreateRoleBody;
    tx?: unknown;
  }) => {
    /// here we can add any role specific logic before creating an role.
    const createRole = this.moduleService.create({
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: RoleErrorCode.MODULE_NAME_CONFLICT,
        },
      ],
      countChecker: [
        {
          keys: ["organizationId"],
          errorKey: RoleErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });
    return await createRole({
      ...params,
      data: { ...params.data, organizationId: params.context.organizationId! },
    });
  };

  // ===============================
  // UPDATE
  // ===============================
  update = async (params: {
    context: Context;
    data: UpdateRoleBody;
    id: string;
    tx?: unknown;
  }) => {
    /// here we can add any role specific logic before updating an role.
    const updateRole = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey: RoleErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId,
          name: params.data.name,
        },
      },
    });
    return await updateRole({
      ...params,
      data: params.data,
    });
  };

  // ===============================
  // FIND BY ID
  // ===============================

  findById = async (params: { context: Context; id: string }) => {
    const getRoleById = this.moduleService.findById();
    return await getRoleById(params);
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
    const filteredPaginatedRoleList =
      this.moduleService.filteredPaginatedList();
    return await filteredPaginatedRoleList({
      ...params,
      query: {
        ...params.query,
        filters: {
          ...params.query?.filters,
          organizationId: params.context.organizationId!,
        },
      },
    });
  };
}
