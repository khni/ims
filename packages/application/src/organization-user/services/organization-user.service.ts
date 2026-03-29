import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";

import { OrganizationUserErrorCode } from "../errors/errorCode.js";
import {
  CreateOrganizationUserBody,
  UpdateOrganizationUserBody,
} from "@avuny/shared";
import { OrganizationUserRepository } from "../repositories/organozation-user.repository.js";
import { IUserService } from "../../shared.js";
import { fail } from "@avuny/utils";

export class OrganizationUserService {
  ownerName = "Owner";
  private organizationUserRepository: OrganizationUserRepository;
  private moduleService: ModuleService<OrganizationUserRepository>;
  private userService: IUserService;

  constructor({
    organizationUserRepository,
    moduleService,
    userService,
  }: {
    organizationUserRepository: OrganizationUserRepository;
    moduleService: ModuleService<OrganizationUserRepository>;
    userService: IUserService;
  }) {
    this.organizationUserRepository = organizationUserRepository;
    this.moduleService = moduleService;
    this.userService = userService;

    this.moduleService.setConfig({
      repository: this.organizationUserRepository,
      creationLimit: 10,
      moduleName: "organizationUser",
    });
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
    return await createOrganizationUser({
      ...params,

      data: {
        ...params.data,
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
      data: params.data,
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
      {
        name?: string;
      },
      { createdAt: "asc" | "desc" }
    >;
  }) => {
    const filteredPaginatedOrganizationUserList =
      this.moduleService.filteredPaginatedList();
    return await filteredPaginatedOrganizationUserList({
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

  createOwnerOrganizationUser = async (params: {
    context: Context;
    data: CreateOrganizationUserBody;
    tx?: unknown;
  }) => {
    const organizationUser = await this.organizationUserRepository.create({
      data: {
        name: this.ownerName,
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
