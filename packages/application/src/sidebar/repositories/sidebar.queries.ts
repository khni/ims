import { prisma } from "@avuny/db";

export class SidebarQueries {
  async getAllSidebarOptions() {
    return prisma.sidebarOption.findMany({
      where: {
        isActive: true,
      },
      include: {
        sidebarHeading: {
          select: { name: true, id: true, icon: true },
        },
        resource: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getPermittedSidebarOptions(params: {
    organizationId: string;
    userId: string;
  }) {
    const { organizationId, userId } = params;

    return prisma.sidebarOption.findMany({
      where: {
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
      include: {
        sidebarHeading: {
          select: { name: true, id: true, icon: true },
        },
        resource: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
