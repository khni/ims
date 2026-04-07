import { fail, ModuleErrorCodes, ok } from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { Context, Resource, FieldRules } from "./types.js";
import { IResourcePermission } from "./ServiceGuard/IResourcePermission.js";
import { IActivityLogService } from "./IActivityLogService.js";

export type BeforeDeleteHook<T, Tx> = (params: {
  where: T;
  tx: Tx;
  context: Context;
}) => Promise<T | void>;

export type AfterDeleteHook<T, Tx> = (params: {
  record: T;
  tx: Tx;
  context: Context;
}) => Promise<void>;

export type DeleteHooks<TWhere> = {
  beforeDelete?: BeforeDeleteHook<TWhere, any>;
  afterDelete?: AfterDeleteHook<any, any>;
};
export class DeleteService {
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

  delete =
    <E, R extends IRepository, TWhere>(options: {
      config: {
        moduleName: Resource;
      };
      repository: R;

      hooks?: DeleteHooks<TWhere>;
    }) =>
    async <Tx>(params: {
      where: TWhere;
      context: Context;
      tx?: Tx;
      passResourcePermissionChecker?: boolean;
    }) => {
      let canDelete;
      if (!params.passResourcePermissionChecker) {
        canDelete = await this.resourcePermission.check({
          action: "delete",
          organizationId: params.context.organizationId,
          userId: params.context.userId,
          resource: options.config.moduleName,
        });
        if (!canDelete) {
          return fail(
            ModuleErrorCodes.USER_NO_PERMISSION,
            params.context,
            `${options.config.moduleName}DeleteService.delete`,
          );
        }
      }

      const { where, context } = params;
      const { hooks } = options ?? {};

      const record = await options.repository.createTransaction(
        async (transaction) => {
          const tx = params.tx ?? transaction;
          // 🔵 beforeDelete
          if (hooks?.beforeDelete) {
            await hooks.beforeDelete({
              where,
              tx,
              context,
            });
          }

          const record = await options.repository.delete({
            where,
            tx,
          });

          await this.activityLog.create({
            tx,
            data: {
              event: "delete",
              organizationId: context.organizationId || record.id,
              resourceId: record.id,
              resourceType: options.config.moduleName,
            },
          });

          // 🟢 afterDelete
          if (hooks?.afterDelete) {
            await hooks.afterDelete({ record, tx, context });
          }

          return record as Awaited<ReturnType<R["delete"]>>;
        },
      );

      return ok(
        record,
        context,
        `${options.config.moduleName}DeleteService.delete`,
      );
    };
}
