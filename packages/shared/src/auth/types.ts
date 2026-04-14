import { z } from "@avuny/zod";
import {
  IdentifierWithTransformSchema,
  IdentifierStringSchema,
  createLocalRegisterInputSchema,
  LocalRegisterWithTransformInputSchema,
  LocalRegisterInputSchema,
  otpSignUpInputSchema,
  localLoginInputSchema,
  resetForgettenPasswordInputSchema,
  refreshTokenInputSchema,
  refreshTokenResponseSchema,
  otpTypeSchema,
  createOtpBodyTypeSchema,
  verifyOtpBodyTypeSchema,
  socialLoginParamsTypeSchema,
  SocialLoginParamsSchema,
  userResponseTypeSchema,
  authTokensResponseTypeSchema,
  authResponseTypeSchema,
} from "./schemas.js";

/* =========================
   Identifier Types
========================= */

/**
 * Identifier with transform (email | phone → typed object)
 */
export type IdentifierWithTransform = z.infer<
  typeof IdentifierWithTransformSchema
>;

/**
 * Raw identifier string (email | phone)
 */
export type IdentifierString = z.infer<typeof IdentifierStringSchema>;

/* =========================
   Local Register
========================= */

/**
 * Generic LocalRegister type
 * (useful if you pass custom identifier schema)
 */
export type LocalRegisterInputGeneric<T extends z._ZodType> = z.infer<
  ReturnType<typeof createLocalRegisterInputSchema<T>>
>;

/**
 * Local register with transformed identifier
 */
export type LocalRegisterWithTransformInput = z.infer<
  typeof LocalRegisterWithTransformInputSchema
>;

/**
 * Standard local register (string identifier)
 */
export type LocalRegisterInput = z.infer<typeof LocalRegisterInputSchema>;

/* =========================
   Auth Inputs
========================= */

/**
 * OTP signup
 */
export type OtpSignUpInput = z.infer<typeof otpSignUpInputSchema>;

/**
 * Local login
 */
export type LocalLoginInput = z.infer<typeof localLoginInputSchema>;

/**
 * Reset forgotten password
 */
export type ResetForgettenPasswordInput = z.infer<
  typeof resetForgettenPasswordInputSchema
>;

/* =========================
   Token
========================= */

/**
 * Refresh token input
 */
export type RefreshTokenInput = z.infer<typeof refreshTokenInputSchema>;

/**
 * Refresh token response
 */
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

/* =========================
   OTP
========================= */

/**
 * OTP type (dynamic)
 */
export type OtpType = z.infer<typeof otpTypeSchema>;

/**
 * Create OTP body
 */
export type CreateOtpBody = z.infer<typeof createOtpBodyTypeSchema>;

/**
 * Verify OTP body
 */
export type VerifyOtpBody = z.infer<typeof verifyOtpBodyTypeSchema>;

/* =========================
   Social Auth
========================= */

/**
 * Social login params (OpenAPI version)
 */
export type SocialLoginParamsType = z.infer<typeof socialLoginParamsTypeSchema>;

/**
 * Social login params (runtime schema)
 */
export type SocialLoginParams = z.infer<typeof SocialLoginParamsSchema>;

/* =========================
   User & Auth Response
========================= */

/**
 * User response
 */
export type UserResponse = z.infer<typeof userResponseTypeSchema>;

/**
 * Auth tokens
 */
export type AuthTokensResponse = z.infer<typeof authTokensResponseTypeSchema>;

/**
 * Full auth response
 */
export type AuthResponse = z.infer<typeof authResponseTypeSchema>;
