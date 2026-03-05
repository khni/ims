import { RefreshToken } from "@avuny/db/types";
import {
  CreateTokensInput,
  IRefreshTokenRepository,
} from "../lib/auth/interfaces/IRefreshTokenRepository.js";
import { prisma } from "@avuny/db";

export class RefreshTokenRepository implements IRefreshTokenRepository<RefreshToken> {
  async findUnique({
    where,
  }: {
    where: { token: string };
  }): Promise<{
    token: string;
    revokedAt: Date | null;
    userId: string;
    id: string;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    return await prisma.refreshToken.findUnique({ where });
  }
  async create(
    data: CreateTokensInput & { token: string }
  ): Promise<RefreshToken> {
    return await prisma.refreshToken.create({ data });
  }

  async delete(token: string) {
    return await prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }
}
