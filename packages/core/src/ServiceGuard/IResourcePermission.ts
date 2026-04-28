import { Action, Resource } from "../types.js";

// check if resource is "organization" and action is create, return true
// after it check if organizationId is provided, if not return false
export interface IResourcePermission {
  check(
    params:
      | {
          organizationId?: string;
          userId: string;
          resource: Resource;
          action: Action;
        }
      | {
          organizationId?: string;
          userId: string;
          permissions: {
            resource: Resource;
            action: Action;
          }[];
        },
  ): Promise<boolean>;
}
