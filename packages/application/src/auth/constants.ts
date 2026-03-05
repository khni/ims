export const refreshTokenCookieOpts = {
  cookieName: "refreshToken",
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
  maxAge: 60 * 60 * 24 * 15, // 15 days in seconds
} as const;
