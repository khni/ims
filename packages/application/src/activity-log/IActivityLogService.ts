import {
  ActivityActorType,
  ActivityEventType,
  ResourceType,
} from "@avuny/db/types";

export interface IActivityLogService<Tx = unknown> {
  create(params: {
    data: {
      organizationId?: string;
      resourceId: string;
      resourceType: ResourceType;
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
