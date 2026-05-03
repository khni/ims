import { type Tx, type DB, PrismaTransaction } from "@avuny/db";

import type {
  CreateUnitCollectionRepo,
  UpdateUnitCollectionRepo,
  UnitCollectionRepoFilters,
  UnitCollectionRepoSorting,
  UnitCollectionWhereUniqueInput,
} from "@avuny/shared";

import { IRepository } from "@avuny/core";
import { t } from "i18next";

/**
 * UnitCollection Repository
 *
 * Responsibility:
 * - Handles all DB operations for unitCollection
 * - Abstracts Prisma from service layer
 * - Supports transactions via Tx
 */
export class UnitCollectionRepository
  extends PrismaTransaction
  implements IRepository
{
  private readonly db: DB;

  constructor({ db }: { db: DB }) {
    super();
    this.db = db;
  }

  /**
   * Get DB instance (transaction-safe)
   */
  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /* =========================
     Create
  ========================= */

  /**
   * Create unitCollection
   */
  async create(params: { data: CreateUnitCollectionRepo; tx?: Tx }) {
    const { data, tx } = params;
    const { targetUnitLines, ...restData } = data;
    const db = this.getDB(tx);

    return db.unitCollection.create({
      data: {
        ...restData,
        targetUnitLines: {
          create: targetUnitLines.map((tl) => ({
            factor: tl.factor,
            targetUnitId: tl.targetUnit.id,
          })),
        },
      },
      select: { id: true, name: true },
    });
  }

  /**
   * Create many unitCollection
   */
  async createMany(params: {
    data: CreateUnitCollectionRepo[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }): Promise<{
    count: number;
  }> {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.unitCollection.createMany({
      data,
      skipDuplicates,
    });
  }

  /* =========================
     Read
  ========================= */

  /**
   * Find first unitCollection
   */
  async find(params: {
    where: UnitCollectionRepoFilters;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.unitCollection.findFirst({
      where,
      select: { id: true },
    });
  }

  /**
   * Find unique unitCollection
   */
  async findUnique(params: { where: UnitCollectionWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.unitCollection.findUnique({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        baseUnitId: true,

        targetUnitLines: {
          select: {
            id: true,
            targetUnit: {
              select: {
                id: true,
                name: true,
              },
            },
            factor: true,
          },
        },
      },
    });
  }

  /**
   * Find by ID (helper)
   */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.unitCollection.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        baseUnitId: true,

        targetUnitLines: {
          select: {
            id: true,

            targetUnit: {
              select: {
                id: true,
                name: true,
              },
            },
            factor: true,
          },
        },
      },
    });
  }

  /**
   * Find many unitCollection
   */
  async findMany(params: {
    where?: UnitCollectionRepoFilters;
    orderBy?: UnitCollectionRepoSorting;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.unitCollection.findMany({
      ...query,
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find unit. collection options
   */
  async getOptions(params: {
    where?: UnitCollectionRepoFilters;
    take?: number;
    tx?: Tx;
    cursor?: { id: string };
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.unitCollection.findMany({
      ...query,
      select: { id: true, name: true },
    });
  }

  /**
   * Count unitCollection
   */
  async count(params?: { where?: UnitCollectionRepoFilters; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.unitCollection.count({
      where,
    });
  }

  /* =========================
     Update
  ========================= */

  /**
   * Update unitCollection
   */
  async update(params: {
    where: UnitCollectionWhereUniqueInput;
    data: UpdateUnitCollectionRepo;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const { targetUnitLines, ...restData } = data;
    const db = this.getDB(tx);

    return db.unitCollection.update({
      where,
      data: {
        ...restData,
        targetUnitLines: {
          deleteMany: { collectionId: where.id },
          create: targetUnitLines.map((tl) => ({
            factor: tl.factor,
            targetUnitId: tl.targetUnit.id,
          })),
        },
      },
    });
  }

  /* =========================
     Delete
  ========================= */

  /**
   * Delete unitCollection
   */
  async delete(params: { where: UnitCollectionWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.unitCollection.delete({
      where,
      select: { id: true },
    });
  }
}
