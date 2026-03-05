import jwt, { JwtPayload } from "jsonwebtoken";

import crypto from "crypto";
import {
  AuthDomainErrorCodesType,
  AuthenticatedErrorCodes,
} from "../errors/errors.js";
import {
  BaseRefreshToken,
  IRefreshTokenRepository,
} from "../interfaces/IRefreshTokenRepository.js";
import { generateExpiredDate, ValidTimeString } from "@khni/utils";
import { fail, ok, Result } from "@avuny/utils";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  tokenType: string;
}

export class TokensService<RefreshToken extends BaseRefreshToken> {
  private jwtTokenType = "access";
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository<RefreshToken>,
    private refreshTokenExpiresIn: ValidTimeString,
    private accessTokenSecret: string,
    private accessTokenExpiresIn: ValidTimeString
  ) {}

  issue = async ({ userId }: { userId: string }) => {
    const refreshToken = await this.refreshTokenRepository.create({
      expiresAt: generateExpiredDate(this.refreshTokenExpiresIn),
      userId,
      token: crypto.randomBytes(64).toString("hex"),
      revokedAt: null,
    });
    const payload: AccessTokenPayload = {
      userId,
      tokenType: this.jwtTokenType,
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });

    return ok({
      accessToken,
      refreshToken: refreshToken.token,
    });
  };

  verifyAccessToken = (accessToken: string) => {
    let payLoad: AccessTokenPayload;
    try {
      payLoad = jwt.verify(
        accessToken,
        this.accessTokenSecret
      ) as AccessTokenPayload;
    } catch (error) {
      return fail(AuthenticatedErrorCodes.UNAUTHENTICATED);
    }

    return ok({ userId: payLoad.userId, tokenType: payLoad.tokenType });
  };

  deleteRefreshToken = async (token: string) => {
    return await this.refreshTokenRepository.delete(token);
  };

  // Add this to unauthorised  error co "REFRESH_TOKEN_INVALID",
  //with mapping to status 401
  verifyRefreshToken = async ({
    token,
    findUniqueUser,
  }: {
    token: string;
    findUniqueUser?: (args: { where: { id: string } }) => Promise<unknown>;
  }) => {
    // implementation

    const refreshToken = await this.refreshTokenRepository.findUnique({
      where: { token },
    });

    if (
      !refreshToken ||
      refreshToken.expiresAt < new Date() ||
      refreshToken.revokedAt
    ) {
      return fail(AuthenticatedErrorCodes.AUTH_REFRESH_TOKEN_INVALID);
    }

    const user = await findUniqueUser?.({ where: { id: refreshToken.userId } });
    if (findUniqueUser && !user) {
      return fail(AuthenticatedErrorCodes.AUTH_REFRESH_TOKEN_INVALID);
    }
    console.log("@@@REFRESHTOKEN ROCORD", refreshToken);
    return ok({ userId: refreshToken.userId });
  };
}
