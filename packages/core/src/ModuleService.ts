import { IRepository } from "./IRepository.js";
import { CreateHooks, CreateService } from "./CreateService.js";
import { UpdateHooks, UpdateService } from "./UpdateService.js";
import { QueryService } from "./QueryService.js";
import { ServiceContext as Context, FieldRules, Resource } from "./types.js";

export class ModuleService<R extends IRepository> {
  protected repository!: R;
  protected creationLimit!: number;
  protected moduleName!: Resource;

  private createService: CreateService;
  private updateService: UpdateService;
  private queryService: QueryService;

  constructor({
    createService,
    updateService,
    queryService,
  }: {
    createService: CreateService;
    updateService: UpdateService;
    queryService: QueryService;
  }) {
    this.createService = createService;
    this.updateService = updateService;
    this.queryService = queryService;
  }

  /**
   * Inject module configuration once
   */
  setConfig(config: {
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

  create = <E>(options?: {
    uniqueChecker?: FieldRules<Parameters<R["create"]>[0]["data"], E>;
    countChecker?: FieldRules<Parameters<R["create"]>[0]["data"], E>;

    hooks?: CreateHooks<Parameters<R["create"]>[0]["data"]>;
  }) => {
    const { repository, config } = this.getConfig();

    return this.createService.create<E, R, Parameters<R["create"]>[0]["data"]>({
      repository,
      config,
      uniqueChecker: options?.uniqueChecker,
      countChecker: options?.countChecker,
      hooks: options?.hooks,
    });
  };

  // ===============================
  // UPDATE
  // ===============================

  update = <E, T extends Parameters<R["update"]>[0]["data"]>(options?: {
    uniqueChecker?: {
      rules: FieldRules<Parameters<R["find"]>[0]["where"], E>;
      uniqueCheckerData: Parameters<R["find"]>[0]["where"];
    };
    hooks?: UpdateHooks<Parameters<R["update"]>[0]["data"]>;
  }) => {
    const { repository, config } = this.getConfig();

    return this.updateService.update<E, R, T>({
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
