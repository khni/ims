import {
  ActivityActorType,
  ActivityEventType,
  ResourceName,
} from "@avuny/db/types";

export interface IActivityLogService<Tx = unknown> {
  create(params: {
    data: {
      organizationId?: string;
      resourceId: string;
      resourceType: ResourceName;
      event: ActivityEventType;
      actorId?: string | null;
      actorType?: ActivityActorType;
      resourceSnapshot?: Record<string, unknown>;
      changes?: {
        before: Record<string, unknown>;
        after: Record<string, unknown>;
      };
    };
    tx?: Tx;
  }): Promise<unknown>;
}
