import { getEnum } from "@avuny/utils";
import en from "../../../intl/locales/warehouse/en.json" with { type: "json" };

/**
 * Warehouse Error Codes
 *
 * Source of truth: translation file (en.json)
 * - Ensures consistency between backend & i18n
 */
export const WarehouseErrorCode = getEnum(en.errors);

/**
 * All possible error keys (type-safe)
 */
export type WarehouseErrorCodeKeys =
  keyof typeof WarehouseErrorCode;
