import { IResourcePermission, Action, Resource } from "@avuny/core";
import { prisma, PrismaClient, SystemCustomPermission } from "@avuny/db";
export class ResourcePermissionChecker implements IResourcePermission {
  constructor() {}

  async check(params: {
    organizationId: string;
    userId: string;
    resource: Resource;
    action: Action;
  }): Promise<boolean> {
    const { organizationId, userId, resource, action } = params;

    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId,
        organizationId,
        status: "ACTIVE",
        role: {
          OR: [
            // ✅ FULL_ACCESS custom permission
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

            {
              rolePermissions: {
                some: {
                  isActive: true,
                  permission: {
                    action: { name: action },
                    resource: { name: resource },
                  },
                },
              },
            },
          ],
        },
      },
      select: { id: true },
    });

    return Boolean(orgUser);
  }
}
