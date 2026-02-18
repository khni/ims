// src/domain/errors.ts
export const ServiceGuardErrorCodes = {
  ACCESS_DENIED: "ACCESS_DENIED",
} as const;
export type ServiceGuardErrorCodesType =
  (typeof ServiceGuardErrorCodes)[keyof typeof ServiceGuardErrorCodes];
