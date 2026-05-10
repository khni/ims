import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";

import {
  CreateWarehouseBody,
  UpdateWarehouseBody,
  WarehouseFilters,
  WarehouseSorting,
  WarehouseRepoFilters,
  WarehouseRepoSorting,
} from "@avuny/shared";

import { WarehouseRepository } from "../repositories/warehouse.repository.js";
import { WarehouseErrorCode } from "../errors/warehouse.error-code.js";

/**
 * Warehouse Service
 *
 * Responsibility:
 * - Handles business logic
 * - Validates and transforms input
 * - Delegates DB operations to repository via ModuleService
 */
export class WarehouseService {
  private warehouseRepository: WarehouseRepository;
  private moduleService: ModuleService<WarehouseRepository>;

  constructor({
    warehouseRepository,
    moduleService,
  }: {
    warehouseRepository: WarehouseRepository;
    moduleService: ModuleService<WarehouseRepository>;
  }) {
    this.warehouseRepository = warehouseRepository;
    this.moduleService = moduleService;

    /**
     * Module configuration
     */
    this.moduleService.setConfig({
      repository: this.warehouseRepository,
      creationLimit: 10,
      moduleName: "warehouse",
    });
  }

  /* =========================
     Serialization
  ========================= */

  /**
   * Transform UI filters → Repo filters
   */
  serializeFilters(
    input: WarehouseFilters & { organizationId: string },
  ): WarehouseRepoFilters {
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
            ],
          }
        : {}),
    };
  }

  /**
   * Transform UI sorting → Repo sorting
   */
  serializeSorting(input?: WarehouseSorting): WarehouseRepoSorting {
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
   * Create warehouse
   */
  create = async (params: {
    context: Context;
    data: CreateWarehouseBody;
    tx?: unknown;
  }) => {
    const createWarehouse = this.moduleService.create({
      /**
       * Prevent duplicate names per organization
       */
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: WarehouseErrorCode.MODULE_NAME_CONFLICT,
        },
      ],

      /**
       * Limit number of created records per organization
       */
      countChecker: [
        {
          keys: ["organizationId"],
          errorKey: WarehouseErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });

    return await createWarehouse({
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
   * Update warehouse
   */
  update = async (params: {
    context: Context;
    id: string;
    data: UpdateWarehouseBody;
    tx?: unknown;
  }) => {
    const updateWarehouse = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey: WarehouseErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId!,
          name: params.data.name,
        },
      },
    });

    return await updateWarehouse({
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
   * Delete warehouse
   */
  delete = async (params: {
    context: Context;
    where: { id: string };
    tx?: unknown;
  }) => {
    const deleteWarehouse = this.moduleService.delete();

    return await deleteWarehouse(params);
  };

  /* =========================
     FIND BY ID
  ========================= */

  /**
   * Get warehouse by ID
   */
  findById = async (params: { context: Context; id: string }) => {
    const findById = this.moduleService.findById();
    return await findById(params);
  };

  /* =========================
     FILTERED PAGINATED LIST
  ========================= */

  /**
   * Get filtered + paginated warehouse list
   */
  filteredPaginatedList = async (params: {
    context: Context;
    query?: FilteredPaginatedList<WarehouseFilters, WarehouseSorting>;
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
    query: { name?: string; cursor?: { id: string } };
  }) => {
    const list = this.moduleService.getOptions();

    return await list({
      ...params,
      query: {
        filters: {
          organizationId: params.context.organizationId!,
          name: params.query.name,
        },
        cursor: params.query.cursor,
      },
      permissions: [
        { resource: "warehouse", action: "read" },
        { resource: "item", action: "create" },
      ],
    });
  };
}
