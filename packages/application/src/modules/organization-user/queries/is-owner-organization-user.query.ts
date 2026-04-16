import { prisma, SystemCustomPermission } from "@avuny/db";
import { IIsOwnerOrganizationUserQuery } from "../../../shared/is-owner-oganization-user.query.interface.js";

export class IsOwnerOrganizationUserQuery implements IIsOwnerOrganizationUserQuery {
  check = async ({
    query,
  }: {
    query: {
      organizationId: string;
      userId: string;
    };
  }) => {
    const result = await prisma.organizationUser.findFirst({
      where: {
        userId: query.userId,
        organizationId: query.organizationId,
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
      select: { id: true },
    });

    return !!result;
  };
}
