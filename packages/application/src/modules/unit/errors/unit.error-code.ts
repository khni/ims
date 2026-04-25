import { getEnum } from "@avuny/utils";
import en from "../../../intl/locales/unit/en.json" with { type: "json" };

/**
 * Unit Error Codes
 *
 * Source of truth: translation file (en.json)
 * - Ensures consistency between backend & i18n
 */
export const UnitErrorCode = getEnum(en.errors);

/**
 * All possible error keys (type-safe)
 */
export type UnitErrorCodeKeys =
  keyof typeof UnitErrorCode;
