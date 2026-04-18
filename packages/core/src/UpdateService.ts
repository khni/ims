import {
  creationLimitExceeded,
  fail,
  ModuleErrorCodes,
  ok,
} from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { checkUnique } from "./checkUnique.js";
import { Context, Resource, FieldRules } from "./types.js";
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

export type UpdateHooks<TUpdateInput> = {
  beforeUpdate?: BeforeUpdateHook<TUpdateInput, any>;
  afterUpdate?: AfterUpdateHook<any, any>;
};

export class UpdateService {
  private activityLog: IActivityLogService;
  private resourcePermission: IResourcePermission;

  constructor({
    activityLog,
    resourcePermission,
  }: {
    activityLog: IActivityLogService;
    resourcePermission: IResourcePermission;
  }) {
    this.activityLog = activityLog;
    this.resourcePermission = resourcePermission;
  }

  update =
    <
      E,
      R extends IRepository,
      T extends Parameters<R["update"]>[0]["data"],
    >(options: {
      uniqueChecker?: {
        rules: FieldRules<Parameters<R["find"]>[0]["where"], E>;
        uniqueCheckerData: Parameters<R["find"]>[0]["where"];
      };

      hooks?: UpdateHooks<Parameters<R["update"]>[0]["data"]>;
      config: {
        moduleName: Resource;
      };
      repository: R;
    }) =>
    async <Tx>(params: { data: T; id: string; context: Context; tx?: Tx }) => {
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
      const recordIsExist = (await options.repository.findUnique({
        where: { id: params.id },
      })) as Awaited<ReturnType<R["findUnique"]>>;
      if (!recordIsExist) {
        return fail(
          ModuleErrorCodes.RESOURCE_NOT_FOUND,
          params.context,
          `${options.config.moduleName}QueryService.findById`,
        );
      }
      const { data, context, id } = params;
      const { uniqueChecker, hooks } = options ?? {};

      // 🔴 Unique check
      if (uniqueChecker) {
        const uniqueError = await checkUnique<
          Parameters<R["find"]>[0]["where"],
          E
        >({
          data: uniqueChecker?.uniqueCheckerData,
          uniqueChecker: uniqueChecker?.rules,
          context,
          id,
          repository: options.repository,
          config: {
            moduleName: options.config.moduleName,
            action: "update",
          },
        });

        if (uniqueError) return uniqueError;
      }

      const record = await options.repository.createTransaction(
        async (transaction) => {
          // let finalData = { ...data };
          const tx = params.tx ?? transaction;
          // 🔵 beforeUpdate
          if (hooks?.beforeUpdate) {
            const modified = await hooks.beforeUpdate({
              data,
              id,
              tx,
              context,
            });
          }

          const record = await options.repository.update({
            data,
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
