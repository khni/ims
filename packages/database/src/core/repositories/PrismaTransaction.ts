import { prisma } from "../../client.js";
import { Tx } from "../types.js";

export class PrismaTransaction {
  async createTransaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T> {
    try {
      return await prisma.$transaction(async (tx) => {
        return await callback(tx);
      });
    } catch (error) {
      throw new Error(`Error: Transaction failed`, {
        cause: error,
      });
    }
  }
}
