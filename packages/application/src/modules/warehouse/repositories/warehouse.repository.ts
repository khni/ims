import { type Tx, type DB, PrismaTransaction } from "@avuny/db";

import type {
  CreateWarehouseRepo,
  UpdateWarehouseRepo,
  WarehouseRepoFilters,
  WarehouseRepoSorting,
  WarehouseWhereUniqueInput,
} from "@avuny/shared";

import { IRepository } from "@avuny/core";

/**
 * Warehouse Repository
 *
 * Responsibility:
 * - Handles all DB operations for warehouse
 * - Abstracts Prisma from service layer
 * - Supports transactions via Tx
 */
export class WarehouseRepository
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
   * Create warehouse
   */
  async create(params: { data: CreateWarehouseRepo; tx?: Tx }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    const { bins, ...warehouseData } = data;

    return db.warehouse.create({
      data: {
        ...warehouseData,
        bins: { create: bins },
      },
      select: { id: true, name: true },
    });
  }

  /**
   * Create many warehouse
   */
  async createMany(params: {
    data: CreateWarehouseRepo[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }): Promise<{
    count: number;
  }> {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.warehouse.createMany({
      data,
      skipDuplicates,
    });
  }

  /* =========================
     Read
  ========================= */

  /**
   * Find first warehouse
   */
  async find(params: {
    where: WarehouseRepoFilters;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.warehouse.findFirst({
      where,
      select: { id: true },
    });
  }

  /**
   * Find unique warehouse
   */
  async findUnique(params: { where: WarehouseWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.warehouse.findUnique({
      where,
    });
  }

  /**
   * Find by ID (helper)
   */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.warehouse.findUnique({
      where: { id },
    });
  }

  /**
   * Find many warehouse
   */
  async findMany(params: {
    where?: WarehouseRepoFilters;
    orderBy?: WarehouseRepoSorting;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.warehouse.findMany({
      ...query,
    });
  }

  /**
   * Find unit. warehouse options
   */
  async getOptions(params: {
    where?: WarehouseRepoFilters;
    take?: number;
    tx?: Tx;
    cursor?: { id: string };
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.warehouse.findMany({
      ...query,
      select: { id: true, name: true },
    });
  }

  /**
   * Count warehouse
   */
  async count(params?: { where?: WarehouseRepoFilters; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.warehouse.count({
      where,
    });
  }

  /* =========================
     Update
  ========================= */

  /**
   * Update warehouse
   */
  async update(params: {
    where: WarehouseWhereUniqueInput;
    data: UpdateWarehouseRepo;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.warehouse.update({
      where,
      data,
    });
  }

  /* =========================
     Delete
  ========================= */

  /**
   * Delete warehouse
   */
  async delete(params: { where: WarehouseWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.warehouse.delete({
      where,
      select: { id: true },
    });
  }
}
