import { prisma, type Prisma, Tx, DB } from "@avuny/db";

export class ActivityLogRepository {
  constructor(private readonly db: DB = prisma) {}

  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /** Create activity log */
  async create(params: { data: Prisma.ActivityLogCreateInput; tx?: Tx }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.activityLog.create({
      data,
      select: { id: true },
    });
  }

  /** Find activity log by ID */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.activityLog.findUnique({
      where: { id },
    });
  }

  /** Find many activity logs */
  async findMany(params?: {
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.activityLog.findMany({
      ...query,
    });
  }

  /** Update activity log */
  async update(params: {
    where: Prisma.ActivityLogWhereUniqueInput;
    data: Prisma.ActivityLogUpdateInput;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.activityLog.update({
      where,
      data,
    });
  }

  /** Delete activity log */
  async delete(params: { where: Prisma.ActivityLogWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.activityLog.delete({
      where,
      select: { id: true },
    });
  }

  /** Count activity logs */
  async count(params?: { where?: Prisma.ActivityLogWhereInput; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.activityLog.count({ where });
  }

  /** Create many activity logs */
  async createMany(params: {
    data: Prisma.ActivityLogCreateManyInput[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.activityLog.createMany({
      data,
      skipDuplicates,
    });
  }
}
