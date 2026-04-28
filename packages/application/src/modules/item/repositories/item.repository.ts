import { type Tx, type DB, PrismaTransaction } from "@avuny/db";

import type {
  CreateItemRepo,
  UpdateItemRepo,
  ItemRepoFilters,
  ItemRepoSorting,
  ItemWhereUniqueInput,
} from "@avuny/shared";

import { IRepository } from "@avuny/core";

/**
 * Item Repository
 *
 * Responsibility:
 * - Handles all DB operations for item
 * - Abstracts Prisma from service layer
 * - Supports transactions via Tx
 */
export class ItemRepository extends PrismaTransaction implements IRepository {
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
   * Create item
   */
  async create(params: { data: CreateItemRepo; tx?: Tx }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.item.create({
      data,
      select: { id: true, name: true },
    });
  }

  /**
   * Create many item
   */
  async createMany(params: {
    data: CreateItemRepo[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }): Promise<{
    count: number;
  }> {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.item.createMany({
      data,
      skipDuplicates,
    });
  }

  /* =========================
     Read
  ========================= */

  /**
   * Find first item
   */
  async find(params: {
    where: ItemRepoFilters;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.item.findFirst({
      where,
      select: { id: true },
    });
  }

  /**
   * Find unique item
   */
  async findUnique(params: { where: ItemWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.item.findUnique({
      where,
    });
  }

  /**
   * Find by ID (helper)
   */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return db.item.findUnique({
      where: { id },
    });
  }

  /**
   * Find many item
   */
  async findMany(params: {
    where?: ItemRepoFilters;
    orderBy?: ItemRepoSorting;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.item.findMany({
      ...query,
    });
  }

  /**
   * Find item options
   */
  async getOptions(params: {
    where?: ItemRepoFilters;
    take?: number;
    tx?: Tx;
    cursor?: { id: string };
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.item.findMany({
      ...query,
      select: { id: true, name: true },
    });
  }

  /**
   * Count item
   */
  async count(params?: { where?: ItemRepoFilters; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.item.count({
      where,
    });
  }

  /* =========================
     Update
  ========================= */

  /**
   * Update item
   */
  async update(params: {
    where: ItemWhereUniqueInput;
    data: UpdateItemRepo;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.item.update({
      where,
      data,
    });
  }

  /* =========================
     Delete
  ========================= */

  /**
   * Delete item
   */
  async delete(params: { where: ItemWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.item.delete({
      where,
      select: { id: true },
    });
  }
}
