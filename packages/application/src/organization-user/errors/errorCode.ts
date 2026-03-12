import { getEnum } from "@avuny/utils";
import en from "../../intl/locales/organization-user/en.json" with { type: "json" };

export const OrganizationUserErrorCode = getEnum(en.errors);
export type OrganizationUserErrorCodeKeys =
  keyof typeof OrganizationUserErrorCode;
