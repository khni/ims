import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";

import { OrganizationUserErrorCode } from "../errors/errorCode.js";
import {
  CreateOrganizationUserBody,
  OrganizationUserFilters,
  OrganizationUserRepoFilters,
  UpdateOrganizationUserBody,
} from "@avuny/shared";
import { OrganizationUserRepository } from "../repositories/organozation-user.repository.js";
import { IUserService } from "../../../shared.js";
import { fail } from "@avuny/utils";
import { organizationUserConfig } from "../organization-user.config.js";

export class OrganizationUserService {
  private organizationUserRepository: OrganizationUserRepository;
  private moduleService: ModuleService<OrganizationUserRepository>;
  private userService: IUserService;
  private organizationUserConfig: organizationUserConfig;

  constructor({
    organizationUserRepository,
    moduleService,
    userService,
    organizationUserConfig,
  }: {
    organizationUserRepository: OrganizationUserRepository;
    moduleService: ModuleService<OrganizationUserRepository>;
    userService: IUserService;
    organizationUserConfig: organizationUserConfig;
  }) {
    this.organizationUserRepository = organizationUserRepository;
    this.moduleService = moduleService;
    this.userService = userService;
    this.organizationUserConfig = organizationUserConfig;

    this.moduleService.setConfig({
      repository: this.organizationUserRepository,
      creationLimit: 10,
      moduleName: "organizationUser",
    });
  }

  serializeFilters(
    input: OrganizationUserFilters & { organizationId: string },
  ): OrganizationUserRepoFilters {
    const { name, roleName, status, ...restInput } = input;
    return {
      ...(name
        ? {
            OR: [
              { name: { contains: name, mode: "insensitive" } },
              {
                user: { email: { contains: name, mode: "insensitive" } },
              },
            ],
          }
        : {}),

      ...(roleName
        ? {
            role: {
              name: {
                contains: roleName,
                mode: "insensitive",
              },
            },
          }
        : {}),
      NOT: { name: this.organizationUserConfig.ownerName },
      ...(status && Array.isArray(status)
        ? { status: { in: status } }
        : undefined),

      ...restInput,
    };
  }

  // ===============================
  // CREATE
  // ===============================
  create = async (params: {
    context: Context;
    data: CreateOrganizationUserBody;
    tx?: unknown;
  }) => {
    /// here we can add any organizationUser specific logic before creating an organizationUser.
    const createOrganizationUser = this.moduleService.create({
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: OrganizationUserErrorCode.MODULE_NAME_CONFLICT,
        },
      ],

      countChecker: [
        {
          keys: ["organizationId"],
          errorKey: OrganizationUserErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });
    const user = await this.userService.findByIdentifier(
      params.data.identifier,
    );

    if (!user) {
      return fail(
        OrganizationUserErrorCode.USER_NOT_FOUND,
        params.context,
        `OrganizationUserService.create`,
      );
    }

    const existingOrganizationUser =
      await this.organizationUserRepository.findUnique({
        where: {
          userId_organizationId: {
            organizationId: params.context.organizationId!,
            userId: user.id,
          },
        },
      });

    if (existingOrganizationUser) {
      return fail(
        OrganizationUserErrorCode.USER_ALREADY_EXISTS,
        params.context,
        `OrganizationUserService.create`,
      );
    }
    return await createOrganizationUser({
      ...params,

      data: {
        roleId: params.data.roleId,
        name: params.data.name,
        expiresAt: params.data.expiresAt,
        status: "PENDING",
        organizationId: params.context.organizationId!,
        userId: user.id,
      },
    });
  };

  // ===============================
  // UPDATE
  // ===============================
  update = async (params: {
    context: Context;
    data: UpdateOrganizationUserBody;
    id: string;
    tx?: unknown;
  }) => {
    /// here we can add any organizationUser specific logic before updating an organizationUser.
    const updateOrganizationUser = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey: OrganizationUserErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId,
          name: params.data.name,
        },
      },
    });
    return await updateOrganizationUser({
      ...params,
      data: {
        roleId: params.data.roleId,
        name: params.data.name,
        expiresAt: params.data.expiresAt,
      },
    });
  };

  delete = async (params: {
    context: Context;
    where: { id: string };
    tx?: unknown;
  }) => {
    const deleteOrganizationUser = this.moduleService.delete();
    return await deleteOrganizationUser({
      ...params,
    });
  };

  // ===============================
  // FIND BY ID
  // ===============================

  findById = async (params: { context: Context; id: string }) => {
    const getOrganizationUserById = this.moduleService.findById();
    return await getOrganizationUserById(params);
  };
  // ===============================
  // FILTERED PAGINATED LIST
  // ===============================
  filteredPaginatedList = async (params: {
    context: Context;
    query?: FilteredPaginatedList<
      OrganizationUserFilters,
      { role?: "asc" | "desc" }
    >;
  }) => {
    const filters = this.serializeFilters({
      ...params.query?.filters,
      organizationId: params.context.organizationId!,
    });
    const filteredPaginatedOrganizationUserList =
      this.moduleService.filteredPaginatedList();
    return await filteredPaginatedOrganizationUserList({
      ...params,
      query: {
        ...params.query,
        filters,
      },
    });
  };

  createOwnerOrganizationUser = async (params: {
    context: Context;
    data: CreateOrganizationUserBody;
    tx?: unknown;
  }) => {
    const organizationUser = await this.organizationUserRepository.create({
      data: {
        name: this.organizationUserConfig.ownerName,
        organizationId: "",
        roleId: "",
        status: "ACTIVE",
        userId: "",
        expiresAt: null,
      },
    });
    return organizationUser;
  };
}
