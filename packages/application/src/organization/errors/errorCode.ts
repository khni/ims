import { getEnum } from "@avuny/utils";
import en from "../../intl/locales/organization/en.json" with { type: "json" };

export const OrganizationErrorCode = getEnum(en.errors);
export type OrganizationErrorCodeKeys = keyof typeof OrganizationErrorCode;
