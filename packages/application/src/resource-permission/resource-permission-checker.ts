import { IResourcePermission, Action, Resource } from "@avuny/core";
import { prisma, PrismaClient, SystemCustomPermission } from "@avuny/db";
export class ResourcePermissionChecker implements IResourcePermission {
  constructor() {}

  async check(
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
  ): Promise<boolean> {
    const { organizationId, userId } = params;

    const permissionFilters =
      "permissions" in params
        ? params.permissions
        : [{ resource: params.resource, action: params.action }];

    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId,
        organizationId,
        status: "ACTIVE",
        role: {
          OR: [
            // FULL_ACCESS
            {
              roleCustomPermissions: {
                some: {
                  customPermission: {
                    code: SystemCustomPermission.FULL_ACCESS,
                    isActive: true,
                  },
                },
              },
            },

            // Any requested permission matches
            {
              rolePermissions: {
                some: {
                  isActive: true,
                  OR: permissionFilters.map((item) => ({
                    permission: {
                      action: { name: item.action },
                      resource: { name: item.resource },
                    },
                  })),
                },
              },
            },
          ],
        },
      },
      select: { id: true },
    });

    return !!orgUser;
  }
}
