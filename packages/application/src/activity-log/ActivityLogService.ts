import { Prisma, ResourceType } from "@avuny/db";
import { ActivityLogRepository } from "./ActivityLogRepository.js";
import { Tx } from "@avuny/db";
import { ActivityActorType, ActivityEventType } from "@avuny/db/types";
import { IActivityLogService } from "@avuny/core";

export class ActivityLogService implements IActivityLogService<Tx> {
  constructor(
    private repository: ActivityLogRepository = new ActivityLogRepository(),
  ) {}

  create = async ({
    data,
    tx,
  }: {
    data: {
      organizationId?: string;
      resourceId: string;
      resourceType: ResourceType;
      event: ActivityEventType;
      actorId?: string | null;
      actorType?: ActivityActorType;
      resourceSnapshot?: {};
      changes?: { before: {}; after: {} };
    };
    tx?: Tx;
  }) => {
    return await this.repository.create({ data, tx });
  };
}
