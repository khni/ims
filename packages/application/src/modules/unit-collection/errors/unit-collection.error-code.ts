import { getEnum } from "@avuny/utils";
import en from "../../../intl/locales/unit-collection/en.json" with { type: "json" };

/**
 * UnitCollection Error Codes
 *
 * Source of truth: translation file (en.json)
 * - Ensures consistency between backend & i18n
 */
export const UnitCollectionErrorCode = getEnum(en.errors);

/**
 * All possible error keys (type-safe)
 */
export type UnitCollectionErrorCodeKeys =
  keyof typeof UnitCollectionErrorCode;
