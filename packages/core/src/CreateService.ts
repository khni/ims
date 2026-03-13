import {
  creationLimitExceeded,
  fail,
  ModuleErrorCodes,
  ok,
} from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { checkUnique } from "./checkUnique.js";
import { Context, Resource, FieldRules } from "./types.js";
import { IResourcePermission } from "./ServiceGuard/IResourcePermission.js";
import { IActivityLogService } from "./IActivityLogService.js";
import { checkCount } from "./checkCount.js";

export type BeforeCreateHook<T, Tx> = (params: {
  data: T;
  tx: Tx;
  context: Context;
}) => Promise<T | void>;

export type AfterCreateHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: Context;
}) => Promise<void>;

export type CreateHooks<TCreateInput> = {
  beforeCreate?: BeforeCreateHook<TCreateInput, any>;
  afterCreate?: AfterCreateHook<any, any>;
};
export class CreateService {
  constructor(
    private activityLog: IActivityLogService,
    private resourcePermission: IResourcePermission,
  ) {}

  create =
    <E, R extends IRepository, TCreateInput>(options: {
      config: {
        creationLimit: number;
        moduleName: Resource;
      };
      repository: R;
      uniqueChecker?: FieldRules<Parameters<R["find"]>[0]["where"], E>;
      countChecker?: {
        keys: (keyof TCreateInput)[];
        errorKey?: E;
      }[];
      hooks?: CreateHooks<TCreateInput>;
    }) =>
    async <Tx>(params: { data: TCreateInput; context: Context; tx?: Tx }) => {
      const canCreate = await this.resourcePermission.check({
        action: "create",
        organizationId: params.context.organizationId,
        userId: params.context.userId,
        resource: options.config.moduleName,
      });
      if (!canCreate) {
        return fail(
          ModuleErrorCodes.USER_NO_PERMISSION,
          params.context,
          `${options.config.moduleName}CreateService.create`,
        );
      }

      const { data, context } = params;
      const { uniqueChecker, hooks } = options ?? {};

      // 🔴 Creation limit check
      const countError = await checkCount<TCreateInput, E>({
        data,
        countChecker: options.countChecker,
        context,
        repository: options.repository,
        config: {
          creationLimit: options.config.creationLimit,
          moduleName: options.config.moduleName,
        },
      });
      if (countError) return countError;

      // 🔴 Unique check
      const uniqueError = await checkUnique<
        Parameters<R["find"]>[0]["where"],
        E
      >({
        data: { ...data, organizationId: context.organizationId },
        uniqueChecker,
        context,
        repository: options.repository,
        config: {
          moduleName: options.config.moduleName,
          action: "create",
        },
      });

      if (uniqueError) return uniqueError;

      const record = await options.repository.createTransaction(
        async (transaction) => {
          let finalData = { ...data };
          const tx = params.tx ?? transaction;
          // 🔵 beforeCreate
          if (hooks?.beforeCreate) {
            const modified = await hooks.beforeCreate({
              data: finalData,
              tx,
              context,
            });
            if (modified) {
              finalData = {
                ...modified,
              };
            }
          }

          const record = await options.repository.create({
            data: finalData,
            tx,
          });

          await this.activityLog.create({
            tx,
            data: {
              event: "create",
              organizationId: context.organizationId || record.id, // in case of organization creation, the organizationId is the record id
              resourceId: record.id,
              resourceType: options.config.moduleName,
            },
          });

          // 🟢 afterCreate
          if (hooks?.afterCreate) {
            await hooks.afterCreate({ record, tx, context });
          }

          return record as Awaited<ReturnType<R["create"]>>;
        },
      );

      return ok(
        record,
        context,
        `${options.config.moduleName}CreateService.create`,
      );
    };
}
