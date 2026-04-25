import {
  type Tx,
  type DB,
  PrismaTransaction,
} from "@avuny/db";

import type {
  CreateUnitRepo,
  UpdateUnitRepo,
  UnitRepoFilters,
  UnitRepoSorting,
  UnitWhereUniqueInput,
} from "@avuny/shared";

import { IRepository } from "@avuny/core";

/**
 * Unit Repository
 *
 * Responsibility:
 * - Handles all DB operations for unit
 * - Abstracts Prisma from service layer
 * - Supports transactions via Tx
 */
export class UnitRepository
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
   * Create unit
   */
  async create(params: {
    data: CreateUnitRepo;
    tx?: Tx;
  }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.unit.create({
      data,
      select: { id: true, name: true },
    });
  }

  /**
   * Create many unit
   */
  async createMany(params: {
    data: CreateUnitRepo[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }): Promise<{
    count: number;
  }> {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.unit.createMany({
      data,
      skipDuplicates,
    });
  }

  /* =========================
     Read
  ========================= */

  /**
   * Find first unit
   */
  async find(params: {
    where: UnitRepoFilters;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.unit.findFirst({
      where,
      select: { id: true },
    });
  }

  /**
   * Find unique unit
   */
  async findUnique(params: {
    where: UnitWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.unit.findUnique({
      where,
    });
  }

  /**
   * Find by ID (helper)
   */
  async findById(params: {
    id: string;
    tx?: Tx;
  }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.unit.findUnique({
      where: { id },
    });
  }

  /**
   * Find many unit
   */
  async findMany(params: {
    where?: UnitRepoFilters;
    orderBy?: UnitRepoSorting;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.unit.findMany({
      ...query,
    });
  }

  /**
   * Count unit
   */
  async count(params?: {
    where?: UnitRepoFilters;
    tx?: Tx;
  }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.unit.count({
      where,
    });
  }

  /* =========================
     Update
  ========================= */

  /**
   * Update unit
   */
  async update(params: {
    where: UnitWhereUniqueInput;
    data: UpdateUnitRepo;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.unit.update({
      where,
      data,
    });
  }

  /* =========================
     Delete
  ========================= */

  /**
   * Delete unit
   */
  async delete(params: {
    where: UnitWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.unit.delete({
      where,
      select: { id: true },
    });
  }
}
