import { Context } from "../../../types";

export function serviceTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import {
  Context,
  FilteredPaginatedList,
  ModuleService,
} from "@avuny/core";

import {
  Create${featurePascal}Body,
  Update${featurePascal}Body,
  ${featurePascal}Filters,
  ${featurePascal}Sorting,
  ${featurePascal}RepoFilters,
  ${featurePascal}RepoSorting,
} from "@avuny/shared";

import { ${featurePascal}Repository } from "../repositories/${kebabCase}.repository.js";
import { ${featurePascal}ErrorCode } from "../errors/${kebabCase}.error-code.js";

/**
 * ${featurePascal} Service
 *
 * Responsibility:
 * - Handles business logic
 * - Validates and transforms input
 * - Delegates DB operations to repository via ModuleService
 */
export class ${featurePascal}Service {
  private ${featureCamel}Repository: ${featurePascal}Repository;
  private moduleService: ModuleService<${featurePascal}Repository>;

  constructor({
    ${featureCamel}Repository,
    moduleService,
  }: {
    ${featureCamel}Repository: ${featurePascal}Repository;
    moduleService: ModuleService<${featurePascal}Repository>;
  }) {
    this.${featureCamel}Repository = ${featureCamel}Repository;
    this.moduleService = moduleService;

    /**
     * Module configuration
     */
    this.moduleService.setConfig({
      repository: this.${featureCamel}Repository,
      creationLimit: 10,
      moduleName: "${featureCamel}",
    });
  }

  /* =========================
     Serialization
  ========================= */

  /**
   * Transform UI filters → Repo filters
   */
  serializeFilters(
    input: ${featurePascal}Filters & { organizationId: string }
  ): ${featurePascal}RepoFilters {
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
    input?: ${featurePascal}Sorting
  ): ${featurePascal}RepoSorting {
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
   * Create ${featureCamel}
   */
  create = async (params: {
    context: Context;
    data: Create${featurePascal}Body;
    tx?: unknown;
  }) => {
    const create${featurePascal} = this.moduleService.create({
      /**
       * Prevent duplicate names per organization
       */
      uniqueChecker: [
        {
          keys: ["name", "organizationId"],
          errorKey: ${featurePascal}ErrorCode.MODULE_NAME_CONFLICT,
        },
      ],

      /**
       * Limit number of created records per organization
       */
      countChecker: [
        {
          keys: ["organizationId"],
          errorKey:
            ${featurePascal}ErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        },
      ],
    });

    return await create${featurePascal}({
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
   * Update ${featureCamel}
   */
  update = async (params: {
    context: Context;
    id: string;
    data: Update${featurePascal}Body;
    tx?: unknown;
  }) => {
    const update${featurePascal} = this.moduleService.update({
      uniqueChecker: {
        rules: [
          {
            keys: ["name", "organizationId"],
            errorKey:
              ${featurePascal}ErrorCode.MODULE_NAME_CONFLICT,
          },
        ],
        uniqueCheckerData: {
          organizationId: params.context.organizationId,
          name: params.data.name,
        },
      },
    });

    return await update${featurePascal}({
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
   * Delete ${featureCamel}
   */
  delete = async (params: {
    context: Context;
    where: { id: string };
    tx?: unknown;
  }) => {
    const delete${featurePascal} = this.moduleService.delete();

    return await delete${featurePascal}(params);
  };

  /* =========================
     FIND BY ID
  ========================= */

  /**
   * Get ${featureCamel} by ID
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
   * Get filtered + paginated ${featureCamel} list
   */
  filteredPaginatedList = async (params: {
    context: Context;
    query?: FilteredPaginatedList<
      ${featurePascal}Filters,
      ${featurePascal}Sorting
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
`;
}
