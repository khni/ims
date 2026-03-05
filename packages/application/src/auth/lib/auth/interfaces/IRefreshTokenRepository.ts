export type CreateTokensInput = BaseRefreshToken;
export type IssuedTokens<RefreshToken extends BaseRefreshToken> = {
  accessToken: string;
  refreshToken: RefreshToken;
};
export type BaseRefreshToken = {
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
  userId: string;
};
export interface IRefreshTokenRepository<
  RefreshToken extends BaseRefreshToken,
> {
  create(data: CreateTokensInput & { token: string }): Promise<RefreshToken>;
  delete(token: string): Promise<any>;
  findUnique(args: { where: { token: string } }): Promise<RefreshToken | null>;
}
