import { getEnum } from "@avuny/utils";
import en from "../../../intl/locales/item/en.json" with { type: "json" };

/**
 * Item Error Codes
 *
 * Source of truth: translation file (en.json)
 * - Ensures consistency between backend & i18n
 */
export const ItemErrorCode = getEnum(en.errors);

/**
 * All possible error keys (type-safe)
 */
export type ItemErrorCodeKeys = keyof typeof ItemErrorCode;
