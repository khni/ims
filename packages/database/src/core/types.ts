import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

export type Tx = Prisma.TransactionClient;
export type DB = PrismaClient | Tx;
