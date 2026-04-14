import { Context } from "../../types";

export function repositoryTemplate({ featurePascal, featureCamel }: Context) {
  return `import {
  type Tx,
  type DB,
  PrismaTransaction,
} from "@avuny/db";

import type {
  Create${featurePascal}Repo,
  Update${featurePascal}Repo,
  ${featurePascal}RepoFilters,
  ${featurePascal}RepoSorting,
  ${featurePascal}WhereUniqueInput,
} from "@avuny/shared";

import { IRepository } from "@avuny/core";

/**
 * ${featurePascal} Repository
 *
 * Responsibility:
 * - Handles all DB operations for ${featureCamel}
 * - Abstracts Prisma from service layer
 * - Supports transactions via Tx
 */
export class ${featurePascal}Repository
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
   * Create ${featureCamel}
   */
  async create(params: {
    data: Create${featurePascal}Repo;
    tx?: Tx;
  }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return db.${featureCamel}.create({
      data,
      select: { id: true, name: true },
    });
  }

  /**
   * Create many ${featureCamel}
   */
  async createMany(params: {
    data: Create${featurePascal}Repo[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.${featureCamel}.createMany({
      data,
      skipDuplicates,
    });
  }

  /* =========================
     Read
  ========================= */

  /**
   * Find first ${featureCamel}
   */
  async find(params: {
    where: ${featurePascal}RepoFilters;
    tx?: Tx;
  }): Promise<{ id: string } | null> {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.${featureCamel}.findFirst({
      where,
      select: { id: true },
    });
  }

  /**
   * Find unique ${featureCamel}
   */
  async findUnique(params: {
    where: ${featurePascal}WhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.${featureCamel}.findUnique({
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

    return db.${featureCamel}.findUnique({
      where: { id },
    });
  }

  /**
   * Find many ${featureCamel}
   */
  async findMany(params: {
    where?: ${featurePascal}RepoFilters;
    orderBy?: ${featurePascal}RepoSorting;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.${featureCamel}.findMany({
      ...query,
    });
  }

  /**
   * Count ${featureCamel}
   */
  async count(params?: {
    where?: ${featurePascal}RepoFilters;
    tx?: Tx;
  }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.${featureCamel}.count({
      where,
    });
  }

  /* =========================
     Update
  ========================= */

  /**
   * Update ${featureCamel}
   */
  async update(params: {
    where: ${featurePascal}WhereUniqueInput;
    data: Update${featurePascal}Repo;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.${featureCamel}.update({
      where,
      data,
    });
  }

  /* =========================
     Delete
  ========================= */

  /**
   * Delete ${featureCamel}
   */
  async delete(params: {
    where: ${featurePascal}WhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.${featureCamel}.delete({
      where,
      select: { id: true },
    });
  }
}
`;
}
