import { getEnum } from "@avuny/utils";
import en from "../../../intl/locales/role/en.json" with { type: "json" };

export const RoleErrorCode = getEnum(en.errors);
export type RoleErrorCodeKeys = keyof typeof RoleErrorCode;
