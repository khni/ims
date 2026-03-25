import {
  prisma,
  type Prisma,
  Tx,
  DB,
  PrismaTransaction,
  Role,
} from "@avuny/db";
import { IRepository } from "@avuny/core";
import { SystemCustomPermission } from "@avuny/db/types";
import { MutateRoleBody, UpdateRoleBody } from "../types.js";

export class RoleRepository extends PrismaTransaction implements IRepository {
  constructor(private readonly db: DB = prisma) {
    super();
  }

  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /** Create role*/
  async create(params: {
    data: Prisma.RoleCreateManyInput & {
      permissions: { permissionId: string }[];
      customPermissions?: { code: SystemCustomPermission }[];
    };
    tx?: Tx;
  }) {
    const { data, tx } = params;
    const { permissions, customPermissions, ...role } = data;
    const db = this.getDB(tx);

    return await db.role.create({
      data: {
        ...role,

        rolePermissions: {
          create: permissions,
        },

        roleCustomPermissions: {
          create: (customPermissions ?? []).map((cp) => ({
            customPermission: {
              connect: {
                code: cp.code,
              },
            },
          })),
        },
      },
    });
  }

  /** Find roleby ID */
  async findUnique(params: { where: Prisma.RoleWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return await db.role.findUnique({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        rolePermissions: {
          select: {
            id: true,
            permissionId: true,
            permission: {
              select: {
                resource: { select: { name: true } },
                action: { select: { name: true } },
              },
            },
          },
        },
        roleCustomPermissions: {
          select: { customPermission: { select: { code: true } } },
        },
      },
    });
  }
  async find({
    where,
    tx,
  }: {
    where: Partial<Role>;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const db = this.getDB(tx);
    return await db.role.findFirst({ where });
  }

  /** Find many roles */
  async findMany(params: {
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return await db.role.findMany({
      ...query,
    });
  }

  /** Update role*/
  async update(params: {
    data: MutateRoleBody;
    where: { id: string };
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);
    const { permissions, ...role } = data;
    return db.role.update({
      where,
      data: {
        ...role,
        rolePermissions: {
          deleteMany: { roleId: where.id },
          create: permissions,
        },
      },
      select: { id: true, name: true, description: true },
    });
  }

  /** Delete role*/
  async delete(params: { where: Prisma.RoleWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return await db.role.delete({
      where,
      select: { id: true },
    });
  }

  /** Count roles */
  async count(params?: { where?: Prisma.RoleWhereInput; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return await db.role.count({ where });
  }

  /** Create many roles */
  async createMany(params: {
    data: Prisma.RoleCreateManyInput[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return await db.role.createMany({
      data,
      skipDuplicates,
    });
  }
}
