import { z } from "@avuny/zod";

export const IdentifierWithTransformSchema = z.union([
  z.e164().transform((val) => ({ type: "phone" as const, value: val })),
  z.email().transform((val) => ({ type: "email" as const, value: val })),
]);
export const IdentifierStringSchema = z.union([z.e164(), z.email()]);

// ─────────────────────────────────────────────
// localRegisterInputSchema
// ─────────────────────────────────────────────

export const createLocalRegisterInputSchema = <TIdentifier extends z._ZodType>(
  identifierSchema: TIdentifier
) =>
  z
    .object({
      identifier: identifierSchema,
      password: z.string().openapi({ example: "P@ssw0rd" }).min(8).max(20),
      name: z.string().min(1).openapi({ example: "John Doe" }),
    })
    .openapi("LocalRegisterInput");

export const LocalRegisterWithTransformInputSchema =
  createLocalRegisterInputSchema(IdentifierWithTransformSchema);
export const LocalRegisterInputSchema = createLocalRegisterInputSchema(
  IdentifierStringSchema
);
// --- Generated Types ---

/**
 * Type for LocalRegister with transformed identifiers
 */
export type LocalRegisterWithTransformInput = z.infer<
  typeof LocalRegisterWithTransformInputSchema
>;

/**
 * Type for standard LocalRegister with string identifiers
 */
export type LocalRegisterInput = z.infer<typeof LocalRegisterInputSchema>;
// ─────────────────────────────────────────────
// otpSignUpInputSchema
// ─────────────────────────────────────────────
export const otpSignUpInputSchema = z
  .object({
    password: z.string().openapi({ example: "P@ssw0rd" }),
    name: z.string().openapi({ example: "John Doe" }),
  })
  .openapi("OtpSignUpInput");

// ─────────────────────────────────────────────
// localLoginInputSchema
// ─────────────────────────────────────────────
export const localLoginInputSchema = z
  .object({
    identifier: z.string().openapi({ example: "john@example.com" }),
    password: z.string().openapi({ example: "P@ssw0rd" }),
  })
  .openapi("LocalLoginInput");

export type LocalLoginInput = z.infer<typeof localLoginInputSchema>;

// ─────────────────────────────────────────────
// resetForgettenPasswordInputSchema
// ─────────────────────────────────────────────
export const resetForgettenPasswordInputSchema = z
  .object({
    newPassword: z.string().openapi({ example: "NewStrongPassword123" }),
    confirmNewPassword: z.string().openapi({ example: "NewStrongPassword123" }),
  })
  .openapi("ResetForgottenPasswordInput");

// ─────────────────────────────────────────────
// refreshTokenInputSchema
// ─────────────────────────────────────────────
export const refreshTokenInputSchema = z
  .object({
    refreshToken: z
      .string()
      .optional()
      .openapi({ example: "jwt-refresh-token" }),
  })
  .openapi("RefreshTokenInput");

// ─────────────────────────────────────────────
// refreshTokenResponseSchema
// ─────────────────────────────────────────────
export const refreshTokenResponseSchema = z
  .object({
    accessToken: z.string().openapi({ example: "jwt-access-token" }),
  })
  .openapi("RefreshTokenResponse");

// ─────────────────────────────────────────────
// otpTypeSchema (any)
// ─────────────────────────────────────────────
export const otpTypeSchema = z.any().openapi({
  description: "OTP type (e.g. 'email_verification', 'password_reset')",
  example: "email_verification",
});

// ─────────────────────────────────────────────
// createOtpBodyTypeSchema
// ─────────────────────────────────────────────
export const createOtpBodyTypeSchema = z
  .object({
    email: z.string().openapi({ example: "john@example.com" }),
    type: otpTypeSchema,
  })
  .openapi("CreateOtpBody");

// ─────────────────────────────────────────────
// verifyOtpBodyTypeSchema
// ─────────────────────────────────────────────
export const verifyOtpBodyTypeSchema = z
  .object({
    email: z.string().openapi({ example: "john@example.com" }),
    type: otpTypeSchema,
    otp: z.string().openapi({ example: "123456" }),
  })
  .openapi("VerifyOtpBody");

// ─────────────────────────────────────────────
// socialLoginParamsTypeSchema
// ─────────────────────────────────────────────
export const socialLoginParamsTypeSchema = z
  .object({
    code: z.string().openapi({ example: "oauth-google-auth-code" }),
  })
  .openapi("SocialLoginParams");

// ─────────────────────────────────────────────
// userResponseTypeSchema
// ─────────────────────────────────────────────
export const userResponseTypeSchema = z
  .object({
    id: z.string().openapi({ example: "user_123" }),
    name: z.string().openapi({ example: "John Doe" }),
    identifier: z.string().openapi({ example: "john@example.com" }),
  })
  .openapi("UserResponse");

// ─────────────────────────────────────────────
// authTokensResponseTypeSchema
// ─────────────────────────────────────────────
export const authTokensResponseTypeSchema = z
  .object({
    accessToken: z.string().openapi({ example: "jwt-access-token" }),
    refreshToken: z.string().openapi({ example: "jwt-refresh-token" }),
  })
  .openapi("AuthTokensResponse");

// ─────────────────────────────────────────────
// authResponseTypeSchema
// ─────────────────────────────────────────────
export const authResponseTypeSchema = z
  .object({
    user: userResponseTypeSchema,
    tokens: authTokensResponseTypeSchema,
  })
  .openapi("AuthResponse");

export const SocialLoginParamsSchema = z.object({
  code: z.string(),
});
