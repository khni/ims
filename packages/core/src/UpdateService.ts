import {
  creationLimitExceeded,
  fail,
  ModuleErrorCodes,
  ok,
} from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { checkUnique } from "./checkUnique.js";
import { ServiceContext as Context, Resource, UniqueChecker } from "./types.js";
import { IActivityLogService } from "./IActivityLogService.js";
import { IResourcePermission } from "./index.js";

/**
 *
 * Hooks
 *
 */

export type BeforeUpdateHook<T, Tx> = (params: {
  data: T;
  id: string;
  tx: Tx;
  context: Context;
}) => Promise<T | void>;

export type AfterUpdateHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: Context;
}) => Promise<void>;

export type UpdateHooks<TUpdateInput extends Record<string, any>> = {
  beforeUpdate?: BeforeUpdateHook<TUpdateInput, any>;
  afterUpdate?: AfterUpdateHook<any, any>;
};

export class UpdateService {
  constructor(
    private activityLog: IActivityLogService,
    private resourcePermission: IResourcePermission,
  ) {}

  update =
    <
      E,
      R extends IRepository,
      TUpdateInput extends Record<string, any>,
    >(options: {
      uniqueChecker?: UniqueChecker<TUpdateInput, E>;
      hooks?: UpdateHooks<TUpdateInput>;
      config: {
        moduleName: Resource;
      };
      repository: R;
    }) =>
    async <Tx>(params: {
      data: TUpdateInput;
      id: string;
      context: Context;
      tx?: Tx;
    }) => {
      const canUpdate = await this.resourcePermission.check({
        action: "update",
        organizationId: params.context.organizationId,
        userId: params.context.userId,
        resource: options.config.moduleName,
      });
      if (!canUpdate) {
        return fail(
          ModuleErrorCodes.USER_NO_PERMISSION,
          params.context,
          `${options.config.moduleName}UpdateService.update`,
        );
      }
      const { data, context, id } = params;
      const { uniqueChecker, hooks } = options ?? {};

      // 🔴 Unique check
      const uniqueError = await checkUnique<TUpdateInput, E>({
        data: { ...data, organizationId: context.organizationId },
        uniqueChecker,
        context,
        id,
        repository: options.repository,
        config: {
          moduleName: options.config.moduleName,
          action: "update",
        },
      });

      if (uniqueError) return uniqueError;

      const record = await options.repository.createTransaction(
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

          const record = await options.repository.update({
            data: finalData,
            where: { id },
            tx,
          });

          await this.activityLog.create({
            tx,
            data: {
              event: "update",
              organizationId: context.organizationId,
              resourceId: record.id,
              resourceType: options.config.moduleName,
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
        `${options.config.moduleName}UpdateService.update`,
      );
    };
}
