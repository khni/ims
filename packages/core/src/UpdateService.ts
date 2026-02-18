import { creationLimitExceeded, fail, ok } from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { checkUnique } from "./checkUnique.js";
import { ServiceContext as Context } from "./types.js";
import { IActivityLogService } from "./IActivityLogService.js";

/**
 *
 * Hooks
 *
 */

type BeforeUpdateHook<T, Tx> = (params: {
  data: T;
  id: string;
  tx: Tx;
  context: Context;
}) => Promise<T | void>;

type AfterUpdateHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: Context;
}) => Promise<void>;

export class UpdateService<
  R extends IRepository,
  TUpdateInput extends Record<string, any>,
> {
  constructor(
    private repository: R,

    private config: {
      moduleName: "role" | "user" | "organization";
    },
  ) {}

  update =
    <E>(options?: {
      uniqueChecker?: {
        keys: (keyof (TUpdateInput & { organizationId: string }))[];
        errorKey: E;
      }[];
      hooks?: {
        beforeUpdate?: BeforeUpdateHook<TUpdateInput, any>;
        afterUpdate?: AfterUpdateHook<any, any>;
      };
      activityLog?: IActivityLogService;
    }) =>
    async <Tx>(params: {
      data: TUpdateInput;
      id: string;
      context: Context;
      tx?: Tx;
    }) => {
      const { data, context, id } = params;
      const { uniqueChecker, hooks } = options ?? {};

      // 🔴 Unique check
      const uniqueError = await checkUnique<TUpdateInput, E>({
        data: { ...data, organizationId: context.organizationId },
        uniqueChecker,
        context,
        id,
        repository: this.repository,
        config: {
          moduleName: this.config.moduleName,
          action: "update",
        },
      });

      if (uniqueError) return uniqueError;

      const record = await this.repository.createTransaction(
        async (transaction) => {
          let finalData = { ...data };
          const tx = params.tx ?? transaction;
          // 🔵 beforeUpdate
          if (hooks?.beforeUpdate) {
            const modified = await hooks.beforeUpdate({
              data: finalData,
              id,
              tx,
              context,
            });
            if (modified) finalData = modified;
          }

          const record = await this.repository.update({
            data: finalData,
            where: { id },
            tx,
          });

          await options?.activityLog?.create({
            tx,
            data: {
              event: "update",
              organizationId: context.organizationId,
              resourceId: record.id,
              resourceType: this.config.moduleName,
            },
          });

          // 🟢 afterUpdate
          if (hooks?.afterUpdate) {
            await hooks.afterUpdate({ record, tx, context });
          }

          return record as Awaited<ReturnType<R["update"]>>;
        },
      );

      return ok(
        record,
        context,
        `${this.config.moduleName}UpdateService.update`,
      );
    };
}
