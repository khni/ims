import { Action, Resource } from "./types.js";

type ActivityActorType = "user" | "system";

export interface IActivityLogService<Tx = unknown> {
  create(params: {
    data: {
      organizationId?: string;
      resourceId: string;
      resourceType: Resource;
      event: Action;
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
