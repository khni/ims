import {
  prisma,
  type Prisma,
  Tx,
  DB,
  Organization,
  PrismaTransaction,
} from "@avuny/db";
import { IRepository } from "@avuny/core";
import { CreateOrganizationBody } from "../types.js";
export class OrganizationRepository
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

  /** Create Organization */
  async create(params: {
    data: CreateOrganizationBody & { ownerId: string };
    tx?: Tx;
  }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.organization.create({
      data,
      select: { id: true, name: true },
    });
  }

  async find({
    where,
    tx,
  }: {
    where: Partial<Organization>;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const db = this.getDB(tx);
    return await db.organization.findFirst({ where });
  }

  async findUnique(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return await db.organization.findUnique({
      where,
    });
  }

  /** Find Organization by ID */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.organization.findUnique({
      where: { id },
    });
  }

  /** Find many Organizations */
  async findMany(params: {
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.organization.findMany({
      ...query,
    });
  }

  /** Update Organization */
  async update(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    data: Prisma.OrganizationUpdateInput;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.organization.update({
      where,
      data,
    });
  }

  /** Delete Organization */
  async delete(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.organization.delete({
      where,
      select: { id: true },
    });
  }

  /** Count Organizations */
  async count(params?: { where?: Prisma.OrganizationWhereInput; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.organization.count({ where });
  }

  /** Create many Organizations */
  async createMany(params: {
    data: Prisma.OrganizationCreateManyInput[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.organization.createMany({
      data,
      skipDuplicates,
    });
  }
}
