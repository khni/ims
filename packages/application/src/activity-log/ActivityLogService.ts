import { Prisma, ResourceName } from "@avuny/db";
import { ActivityLogRepository } from "./ActivityLogRepository.js";
import { Tx } from "@avuny/db";
import {
  ActionName,
  ActivityActorType,
  ActivityEventType,
} from "@avuny/db/types";
import { IActivityLogService } from "@avuny/core";

export class ActivityLogService implements IActivityLogService<Tx> {
  private activityLogRepository: ActivityLogRepository;

  constructor({
    activityLogRepository = new ActivityLogRepository(),
  }: {
    activityLogRepository: ActivityLogRepository;
  }) {
    this.activityLogRepository = activityLogRepository;
  }

  create = async ({
    data,
    tx,
  }: {
    data: {
      organizationId?: string;
      resourceId: string;
      resourceType: ResourceName;
      event: ActionName;
      actorId?: string | null;
      actorType?: ActivityActorType;
      resourceSnapshot?: {};
      changes?: { before: {}; after: {} };
    };
    tx?: Tx;
  }) => {
    return await this.activityLogRepository.create({ data, tx });
  };
}
