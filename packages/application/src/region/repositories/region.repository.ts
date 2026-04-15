import {
  type Tx,
  type DB,
  PrismaTransaction,
} from "@avuny/db";

import type {
  CreateRegionRepo,
  UpdateRegionRepo,
  RegionRepoFilters,
  RegionRepoSorting,
  RegionWhereUniqueInput,
} from "@avuny/shared";

import { IRepository } from "@avuny/core";

/**
 * Region Repository
 *
 * Responsibility:
 * - Handles all DB operations for region
 * - Abstracts Prisma from service layer
 * - Supports transactions via Tx
 */
export class RegionRepository
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
   * Create region
   */
  async create(params: {
    data: CreateRegionRepo;
    tx?: Tx;
  }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.region.create({
      data,
      select: { id: true, name: true },
    });
  }

  /**
   * Create many region
   */
  async createMany(params: {
    data: CreateRegionRepo[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }): Promise<{
    count: number;
  }> {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.region.createMany({
      data,
      skipDuplicates,
    });
  }

  /* =========================
     Read
  ========================= */

  /**
   * Find first region
   */
  async find(params: {
    where: RegionRepoFilters;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.region.findFirst({
      where,
      select: { id: true },
    });
  }

  /**
   * Find unique region
   */
  async findUnique(params: {
    where: RegionWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.region.findUnique({
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

    return db.region.findUnique({
      where: { id },
    });
  }

  /**
   * Find many region
   */
  async findMany(params: {
    where?: RegionRepoFilters;
    orderBy?: RegionRepoSorting;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.region.findMany({
      ...query,
    });
  }

  /**
   * Count region
   */
  async count(params?: {
    where?: RegionRepoFilters;
    tx?: Tx;
  }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.region.count({
      where,
    });
  }

  /* =========================
     Update
  ========================= */

  /**
   * Update region
   */
  async update(params: {
    where: RegionWhereUniqueInput;
    data: UpdateRegionRepo;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.region.update({
      where,
      data,
    });
  }

  /* =========================
     Delete
  ========================= */

  /**
   * Delete region
   */
  async delete(params: {
    where: RegionWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.region.delete({
      where,
      select: { id: true },
    });
  }
}
