import { PrismaClient } from "../generated/prisma/client.js";

export type PrismaTransactionManager = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
