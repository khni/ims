import { IActivityLogService } from "@avuny/activity-log";

import { creationLimitExceeded, nameConflict, ok } from "@avuny/utils";

import { IRepository } from "./IRepository.js";
import { IMutationService } from "./IMutationService.js";

export class MutationService<
  R extends IRepository,
> implements IMutationService<R> {
  constructor(
    private repository: R,
    private activityLog: IActivityLogService,
    private config: {
      creationLimit: number;
      moduleName: "role" | "user"; // for now
    },
  ) {}

  create = async <
    TCreateInput extends Omit<
      Parameters<R["create"]>[0]["data"],
      "organizationId" | "id"
    > & { name: string },
  >(params: {
    data: TCreateInput;
    context: { userId: string; requestId: string; organizationId: string };
  }) => {
    const { data, context } = params;
    const existsRecord = await this.repository.findUnique({
      where: {
        organizationId_name: {
          name: data.name,
          organizationId: context.organizationId,
        },
      },
    });
    if (existsRecord) {
      return nameConflict(
        context,
        `${this.config.moduleName}MutationService.create`,
      );
    }
    const recordsCount = await this.repository.count({
      where: {
        organizationId: context.organizationId,
      },
    });
    if (recordsCount >= this.config.creationLimit) {
      return creationLimitExceeded(
        context,
        `${this.config.moduleName}MutationService.create`,
      );
    }
    const record = await this.repository.createTransaction(async (tx) => {
      const record = await this.repository.create({
        data: { ...data, organizationId: context.organizationId },
        tx,
      });
      await this.activityLog.create({
        tx,
        data: {
          event: "create",
          organizationId: context.organizationId,
          resourceId: record.id,
          resourceType: this.config.moduleName,
        },
      });
      return record as Awaited<ReturnType<R["create"]>>;
    });
    return ok(
      record,
      context,
      `${this.config.moduleName}MutationService.create`,
    );
  };

  update = async <
    TUpdateInput extends Omit<
      Parameters<R["update"]>[0]["data"],
      "organizationId" | "id"
    > & { name?: string },
  >(params: {
    data: TUpdateInput;
    id: string;
    context: { userId: string; requestId: string; organizationId: string };
  }) => {
    const { data, context, id } = params;
    if (data.name) {
      const existsRecord = await this.repository.findUnique({
        where: {
          organizationId_name: {
            name: data.name,
            organizationId: context.organizationId,
          },
        },
      });
      if (existsRecord && existsRecord.id != id) {
        return nameConflict(
          context,
          `${this.config.moduleName}MutationService.update`,
        );
      }
    }

    const record = await this.repository.createTransaction(async (tx) => {
      const record = await this.repository.update({
        data,
        where: {
          id,
        },
        tx,
      });
      await this.activityLog.create({
        tx,
        data: {
          event: "update",
          organizationId: context.organizationId,
          resourceId: record.id,
          resourceType: this.config.moduleName,
        },
      });
      return record as Awaited<ReturnType<R["update"]>>;
    });
    return ok(
      record,
      context,
      `${this.config.moduleName}MutationService.update`,
    );
  };
}
