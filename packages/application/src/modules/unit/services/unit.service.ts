import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";

import {
  CreateUnitBody,
  UpdateUnitBody,
  UnitFilters,
  UnitSorting,
  UnitRepoFilters,
  UnitRepoSorting,
} from "@avuny/shared";

import { UnitRepository } from "../repositories/unit.repository.js";
import { UnitErrorCode } from "../errors/unit.error-code.js";

/**
 * Unit Service
 *
 * Responsibility:
 * - Handles business logic
 * - Validates and transforms input
 * - Delegates DB operations to repository via ModuleService
 */
export class UnitService {
  private unitRepository: UnitRepository;
  private moduleService: ModuleService<UnitRepository>;

  constructor({
    unitRepository,
    moduleService,
  }: {
    unitRepository: UnitRepository;
    moduleService: ModuleService<UnitRepository>;
  }) {
    this.unitRepository = unitRepository;
    this.moduleService = moduleService;

    /**
     * Module configuration
     */
    this.moduleService.setConfig({
      repository: this.unitRepository,
      creationLimit: 10,
      moduleName: "unit",
    });
  }

  /* =========================
     Serialization
  ========================= */

  /**
   * Transform UI filters → Repo filters
   */
  serializeFilters(
    input: UnitFilters & { organizationId: string },
  ): UnitRepoFilters {
    const { name, ...restInput } = input;

    return {
      ...restInput,
      ...(name
        ? {
            OR: [
              {
                name: {
                  contains: name,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: name,
                  mode: "insensitive",
                },
              },
              {
                symbol: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };
  }

  /**
   * Transform UI sorting → Repo sorting
   */
  serializeSorting(input?: UnitSorting): UnitRepoSorting {
    if (!input) return {};

    const { field, direction } = input;

    return {
      [field]: direction,
    };
  }

  /* =========================
     CREATE
  ========================= */

  /**
   * Create unit
   */
  create = async (params: {
    context: Context;
    data: CreateUnitBody;
    tx?: unknown;
  }) => {
    const createUnit = this.moduleService.create({
      /**
       * Prevent duplicate names per organization
       */
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: UnitErrorCode.MODULE_NAME_CONFLICT,
        },
      ],

      /**
       * Limit number of created records per organization
       */
      countChecker: [
        {
          keys: ["organizationId"],
          errorKey: UnitErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });

    return await createUnit({
      ...params,
      data: {
        ...params.data,
        organizationId: params.context.organizationId!,
      },
    });
  };

  /* =========================
     UPDATE
  ========================= */

  /**
   * Update unit
   */
  update = async (params: {
    context: Context;
    id: string;
    data: UpdateUnitBody;
    tx?: unknown;
  }) => {
    const updateUnit = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey: UnitErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId!,
          name: params.data.name,
        },
      },
    });

    return await updateUnit({
      ...params,
      data: {
        ...params.data,
        organizationId: params.context.organizationId!,
      },
    });
  };

  /* =========================
     DELETE
  ========================= */

  /**
   * Delete unit
   */
  delete = async (params: {
    context: Context;
    where: { id: string };
    tx?: unknown;
  }) => {
    const deleteUnit = this.moduleService.delete();

    return await deleteUnit(params);
  };

  /* =========================
     FIND BY ID
  ========================= */

  /**
   * Get unit by ID
   */
  findById = async (params: { context: Context; id: string }) => {
    const findById = this.moduleService.findById();
    return await findById(params);
  };

  /* =========================
     FILTERED PAGINATED LIST
  ========================= */

  /**
   * Get filtered + paginated unit list
   */
  filteredPaginatedList = async (params: {
    context: Context;
    query?: FilteredPaginatedList<UnitFilters, UnitSorting>;
  }) => {
    const filters = this.serializeFilters({
      ...(params.query?.filters ?? {}),
      organizationId: params.context.organizationId!,
    });

    const orderBy = this.serializeSorting(params.query?.orderBy);

    const list = this.moduleService.filteredPaginatedList();

    return await list({
      ...params,
      query: {
        ...params.query,
        filters,
        orderBy,
      },
    });
  };

  getOptions = async (params: {
    context: Context;
    query: { name?: string; lastId: string };
  }) => {
    const list = this.moduleService.getOptions();

    return await list({
      ...params,
      query: {
        filters: {
          organizationId: params.context.organizationId!,
          name: params.query.name,
        },
        cursor: { id: params.query.lastId },
      },
      permissions: [
        { resource: "unit", action: "read" },
        { resource: "unitCollection", action: "create" },
        { resource: "unitCollection", action: "update" },
      ],
    });
  };
}
