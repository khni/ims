import {
  creationLimitExceeded,
  fail,
  ModuleErrorCodes,
  ok,
} from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { checkUnique } from "./checkUnique.js";
import { ServiceContext as Context } from "./types.js";
import { IResourcePermission } from "./ServiceGuard/IResourcePermission.js";
import { IActivityLogService } from "./IActivityLogService.js";

type BeforeCreateHook<T, Tx> = (params: {
  data: T;
  tx: Tx;
  context: Context;
}) => Promise<T | void>;

type AfterCreateHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: Context;
}) => Promise<void>;

export class CreateService<
  R extends IRepository,
  TCreateInput extends Record<string, any>,
> {
  constructor(
    private repository: R,
    private config: {
      creationLimit: number;
      moduleName: "role" | "user" | "organization";
    },
  ) {}

  create =
    <E>(options?: {
      uniqueChecker?: {
        keys: (keyof (TCreateInput & { organizationId: string }))[];
        errorKey: E;
      }[];
      hooks?: {
        beforeCreate?: BeforeCreateHook<TCreateInput, any>;
        afterCreate?: AfterCreateHook<any, any>;
      };
      activityLog?: IActivityLogService;
      reourcePermission?: IResourcePermission;
    }) =>
    async <Tx>(params: { data: TCreateInput; context: Context; tx?: Tx }) => {
      if (options?.reourcePermission) {
        const canCreate = await options.reourcePermission.check({
          action: "create",
          organizationId: params.context.organizationId,
          userId: params.context.userId,
          resource: this.config.moduleName,
        });
        if (!canCreate) {
          return fail(
            ModuleErrorCodes.USER_NO_PERMISSION,
            params.context,
            `${this.config.moduleName}CreateService.create`,
          );
        }
      }
      const { data, context } = params;
      const { uniqueChecker, hooks } = options ?? {};

      // 🔴 Creation limit check
      const recordsCount = await this.repository.count({
        where: { organizationId: context.organizationId },
      });

      if (recordsCount >= this.config.creationLimit) {
        return creationLimitExceeded(
          context,
          `${this.config.moduleName}CreateService.create`,
        );
      }

      // 🔴 Unique check
      const uniqueError = await checkUnique<TCreateInput, E>({
        data: { ...data, organizationId: context.organizationId },
        uniqueChecker,
        context,
        repository: this.repository,
        config: {
          moduleName: this.config.moduleName,
          action: "create",
        },
      });

      if (uniqueError) return uniqueError;

      const record = await this.repository.createTransaction(
        async (transaction) => {
          let finalData = { ...data, organizationId: context.organizationId };
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
                organizationId: context.organizationId,
              };
            }
          }

          const record = await this.repository.create({
            data: finalData,
            tx,
          });

          await options?.activityLog?.create({
            tx,
            data: {
              event: "create",
              organizationId: context.organizationId,
              resourceId: record.id,
              resourceType: this.config.moduleName,
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
        `${this.config.moduleName}CreateService.create`,
      );
    };
}
