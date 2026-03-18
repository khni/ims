import { IResourcePermission, Action, Resource } from "@avuny/core";
import { prisma, PrismaClient, SystemCustomPermission } from "@avuny/db";
export class SidebarService {
  constructor() {}

  async get(params: { organizationId: string; userId: string }) {
    const { organizationId, userId } = params;

    return prisma.sidebarOption.findMany({
      where: {
        OR: [
          // FULL ACCESS → return everything
          {
            // this condition will be true only if such user exists
            AND: [
              {
                isActive: true, // optional depending on your logic
              },
              {
                resource: {
                  // dummy condition just to keep structure valid
                  // real check happens below in role relation
                  isNot: null,
                },
              },
              {
                resource: {
                  permissions: {
                    some: {
                      rolePermissions: {
                        some: {
                          role: {
                            organizationUsers: {
                              some: {
                                userId,
                                organizationId,
                                status: "ACTIVE",
                                role: {
                                  roleCustomPermissions: {
                                    some: {
                                      customPermission: {
                                        code: SystemCustomPermission.FULL_ACCESS,
                                        isActive: true,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },

          // NORMAL PERMISSIONS
          {
            isActive: true,
            resource: {
              permissions: {
                some: {
                  rolePermissions: {
                    some: {
                      role: {
                        organizationUsers: {
                          some: {
                            userId,
                            organizationId,
                            status: "ACTIVE",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        sidebarHeading: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
