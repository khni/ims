import {
  prisma,
  type Prisma,
  Tx,
  DB,
  OrganizationUser,
  PrismaTransaction,
  OrganizationUserStatus,
} from "@avuny/db";
import { IRepository } from "@avuny/core";
import {
  CreateOrganizationUserBody,
  CreateOrganizationUserRepository,
  OrganizationUserRepoFilters,
  UpdateOrganizationUserBody,
} from "@avuny/shared";
export class OrganizationUserRepository
  extends PrismaTransaction
  implements IRepository
{
  private readonly db: DB;

  constructor({ db }: { db: DB }) {
    super();
    this.db = db;
  }

  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /** Create OrganizationUser */
  async create(params: { data: CreateOrganizationUserRepository; tx?: Tx }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.organizationUser.create({
      data,
      select: { id: true, name: true },
    });
  }

  async find({
    where,
    tx,
  }: {
    where: Partial<OrganizationUser>;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const db = this.getDB(tx);
    return await db.organizationUser.findFirst({ where });
  }

  async findUnique(params: {
    where: Prisma.OrganizationUserWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.findUnique({
      where,
      select: {
        name: true,
        id: true,
        status: true,
        updatedAt: true,
        expiresAt: true,
        user: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  /** Find OrganizationUser by ID */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.organizationUser.findUnique({
      where: { id },
      select: {
        name: true,
        id: true,
        status: true,
        updatedAt: true,
        expiresAt: true,
        user: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  /** Find many OrganizationUsers */
  async findMany(params: {
    where?: OrganizationUserRepoFilters;
    orderBy?: { role?: "asc" | "desc" };
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    console.log("orderBy", params.orderBy);
    const roleOrderBy = params.orderBy?.role
      ? { name: params.orderBy.role }
      : undefined;
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);
    return db.organizationUser.findMany({
      ...query,
      orderBy: { ...query.orderBy, role: roleOrderBy },
      select: {
        name: true,
        id: true,
        status: true,
        updatedAt: true,
        expiresAt: true,
        user: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  /** Update OrganizationUser */
  async update(params: {
    where: Prisma.OrganizationUserWhereUniqueInput;
    data: UpdateOrganizationUserBody;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.organizationUser.update({
      where,
      data,
    });
  }

  /** Delete OrganizationUser */
  async delete(params: {
    where: Prisma.OrganizationUserWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.organizationUser.delete({
      where,
      select: { id: true },
    });
  }

  /** Count OrganizationUsers */
  async count(params?: { where?: OrganizationUserRepoFilters; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.organizationUser.count({
      where,
    });
  }

  /** Create many OrganizationUsers */
  async createMany(params: {
    data: Prisma.OrganizationUserCreateManyInput[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.organizationUser.createMany({
      data,
      skipDuplicates,
    });
  }
}
