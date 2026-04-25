import {
  Context,
  FilteredPaginatedList,
  ModuleService,
} from "@avuny/core";

import {
  CreateUnitCollectionBody,
  UpdateUnitCollectionBody,
  UnitCollectionFilters,
  UnitCollectionSorting,
  UnitCollectionRepoFilters,
  UnitCollectionRepoSorting,
} from "@avuny/shared";

import { UnitCollectionRepository } from "../repositories/unit-collection.repository.js";
import { UnitCollectionErrorCode } from "../errors/unit-collection.error-code.js";

/**
 * UnitCollection Service
 *
 * Responsibility:
 * - Handles business logic
 * - Validates and transforms input
 * - Delegates DB operations to repository via ModuleService
 */
export class UnitCollectionService {
  private unitCollectionRepository: UnitCollectionRepository;
  private moduleService: ModuleService<UnitCollectionRepository>;

  constructor({
    unitCollectionRepository,
    moduleService,
  }: {
    unitCollectionRepository: UnitCollectionRepository;
    moduleService: ModuleService<UnitCollectionRepository>;
  }) {
    this.unitCollectionRepository = unitCollectionRepository;
    this.moduleService = moduleService;

    /**
     * Module configuration
     */
    this.moduleService.setConfig({
      repository: this.unitCollectionRepository,
      creationLimit: 10,
      moduleName: "unitCollection",
    });
  }

  /* =========================
     Serialization
  ========================= */

  /**
   * Transform UI filters → Repo filters
   */
  serializeFilters(
    input: UnitCollectionFilters & { organizationId: string }
  ): UnitCollectionRepoFilters {
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
  serializeSorting(
    input?: UnitCollectionSorting
  ): UnitCollectionRepoSorting {
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
   * Create unitCollection
   */
  create = async (params: {
    context: Context;
    data: CreateUnitCollectionBody;
    tx?: unknown;
  }) => {
    const createUnitCollection = this.moduleService.create({
      /**
       * Prevent duplicate names per organization
       */
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: UnitCollectionErrorCode.MODULE_NAME_CONFLICT,
        },
      ],

      /**
       * Limit number of created records per organization
       */
      countChecker: [
        {
          keys: ["organizationId"],
          errorKey:
            UnitCollectionErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });

    return await createUnitCollection({
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
   * Update unitCollection
   */
  update = async (params: {
    context: Context;
    id: string;
    data: UpdateUnitCollectionBody;
    tx?: unknown;
  }) => {
    const updateUnitCollection = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey:
              UnitCollectionErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId!,
          name: params.data.name,
        },
      },
    });

    return await updateUnitCollection({
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
   * Delete unitCollection
   */
  delete = async (params: {
    context: Context;
    where: { id: string };
    tx?: unknown;
  }) => {
    const deleteUnitCollection = this.moduleService.delete();

    return await deleteUnitCollection(params);
  };

  /* =========================
     FIND BY ID
  ========================= */

  /**
   * Get unitCollection by ID
   */
  findById = async (params: {
    context: Context;
    id: string;
  }) => {
    const findById = this.moduleService.findById();
    return await findById(params);
  };

  /* =========================
     FILTERED PAGINATED LIST
  ========================= */

  /**
   * Get filtered + paginated unitCollection list
   */
  filteredPaginatedList = async (params: {
    context: Context;
    query?: FilteredPaginatedList<
      UnitCollectionFilters,
      UnitCollectionSorting
    >;
  }) => {
    const filters = this.serializeFilters({
      ...(params.query?.filters ?? {}),
      organizationId: params.context.organizationId!,
    });

    const orderBy = this.serializeSorting(
      params.query?.orderBy
    );

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
}
