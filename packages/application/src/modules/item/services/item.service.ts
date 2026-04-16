import { Context, FilteredPaginatedList, ModuleService } from "@avuny/core";

import {
  CreateItemBody,
  UpdateItemBody,
  ItemFilters,
  ItemSorting,
  ItemRepoFilters,
  ItemRepoSorting,
} from "@avuny/shared";

import { ItemRepository } from "../repositories/item.repository.js";
import { ItemErrorCode } from "../errors/item.error-code.js";

/**
 * Item Service
 *
 * Responsibility:
 * - Handles business logic
 * - Validates and transforms input
 * - Delegates DB operations to repository via ModuleService
 */
export class ItemService {
  private itemRepository: ItemRepository;
  private moduleService: ModuleService<ItemRepository>;

  constructor({
    itemRepository,
    moduleService,
  }: {
    itemRepository: ItemRepository;
    moduleService: ModuleService<ItemRepository>;
  }) {
    this.itemRepository = itemRepository;
    this.moduleService = moduleService;

    /**
     * Module configuration
     */
    this.moduleService.setConfig({
      repository: this.itemRepository,
      creationLimit: 10,
      moduleName: "item",
    });
  }

  /* =========================
     Serialization
  ========================= */

  /**
   * Transform UI filters → Repo filters
   */
  serializeFilters(
    input: ItemFilters & { organizationId: string },
  ): ItemRepoFilters {
    const { name, ...restInput } = input;

    return {
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
      ...restInput,
    };
  }

  /**
   * Transform UI sorting → Repo sorting
   */
  serializeSorting(input?: ItemSorting): ItemRepoSorting {
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
   * Create item
   */
  create = async (params: {
    context: Context;
    data: CreateItemBody;
    tx?: unknown;
  }) => {
    const createItem = this.moduleService.create({
      /**
       * Prevent duplicate names per organization
       */
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: ItemErrorCode.MODULE_NAME_CONFLICT,
        },
      ],

      /**
       * Limit number of created records per organization
       */
      countChecker: [
        {
          keys: ["organizationId"],
          errorKey: ItemErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });

    return await createItem({
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
   * Update item
   */
  update = async (params: {
    context: Context;
    id: string;
    data: UpdateItemBody;
    tx?: unknown;
  }) => {
    const updateItem = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey: ItemErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId!,
          name: params.data.name,
        },
      },
    });

    return await updateItem({
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
   * Delete item
   */
  delete = async (params: {
    context: Context;
    where: { id: string };
    tx?: unknown;
  }) => {
    const deleteItem = this.moduleService.delete();

    return await deleteItem(params);
  };

  /* =========================
     FIND BY ID
  ========================= */

  /**
   * Get item by ID
   */
  findById = async (params: { context: Context; id: string }) => {
    const findById = this.moduleService.findById();
    return await findById(params);
  };

  /* =========================
     FILTERED PAGINATED LIST
  ========================= */

  /**
   * Get filtered + paginated item list
   */
  filteredPaginatedList = async (params: {
    context: Context;
    query?: FilteredPaginatedList<ItemFilters, ItemSorting>;
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
}
