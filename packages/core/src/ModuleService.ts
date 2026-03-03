import { IRepository } from "./IRepository.js";
import { CreateHooks, CreateService } from "./CreateService.js";
import { UpdateHooks, UpdateService } from "./UpdateService.js";
import { QueryService } from "./QueryService.js";
import { ServiceContext as Context, Resource } from "./types.js";

export class ModuleService<R extends IRepository> {
  protected repository!: R;
  protected creationLimit!: number;
  protected moduleName!: Resource;

  constructor(
    private createService: CreateService,
    private updateService: UpdateService,
    private queryService: QueryService,
  ) {}

  /**
   * Inject module configuration once
   */
  protected setConfig(config: {
    repository: R;
    creationLimit: number;
    moduleName: Resource;
  }) {
    this.repository = config.repository;
    this.creationLimit = config.creationLimit;
    this.moduleName = config.moduleName;
  }

  private getConfig() {
    return {
      repository: this.repository,
      config: {
        creationLimit: this.creationLimit,
        moduleName: this.moduleName,
      },
    };
  }

  // ===============================
  // CREATE
  // ===============================

  create = <E, TCreateInput extends Record<string, any>>(options?: {
    uniqueChecker?: {
      keys: (keyof (TCreateInput & { organizationId: string }))[];
      errorKey: E;
    }[];
    hooks?: CreateHooks<TCreateInput>;
  }) => {
    const { repository, config } = this.getConfig();

    return this.createService.create<E, R, TCreateInput>({
      repository,
      config,
      uniqueChecker: options?.uniqueChecker,
      hooks: options?.hooks,
    });
  };

  // ===============================
  // UPDATE
  // ===============================

  update = <E, TUpdateInput extends Record<string, any>>(options?: {
    uniqueChecker?: {
      keys: (keyof (TUpdateInput & { organizationId: string }))[];
      errorKey: E;
    }[];
    hooks?: UpdateHooks<TUpdateInput>;
  }) => {
    const { repository, config } = this.getConfig();

    return this.updateService.update<E, R, TUpdateInput>({
      repository,
      config: { moduleName: config.moduleName },
      uniqueChecker: options?.uniqueChecker,
      hooks: options?.hooks,
    });
  };

  // ===============================
  // DELETE
  // ===============================

  // delete = () => {
  //   const { repository, config } = this.getConfig();

  //   return async (params: { id: string; context: Context; tx?: any }) => {
  //     const { id, context, tx } = params;

  //     const record = await repository.delete({
  //       where: { id },
  //       tx,
  //     });

  //     return ok(record, context, `${config.moduleName}ModuleService.delete`);
  //   };
  // };

  // ===============================
  // QUERY
  // ===============================

  filteredPaginatedList = () => {
    const { repository, config } = this.getConfig();

    return this.queryService.filteredPaginatedList({
      repository,
      config: { moduleName: config.moduleName },
    });
  };

  findById = () => {
    const { repository, config } = this.getConfig();

    return this.queryService.findById({
      repository,
      config: { moduleName: config.moduleName },
    });
  };
}
