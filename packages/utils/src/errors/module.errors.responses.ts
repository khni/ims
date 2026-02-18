import { fail } from "../result.js";
import { ModuleErrorCodes } from "./module.errors.js";

export const nameConflict = (context?: any, caller?: string) => {
  return fail(ModuleErrorCodes.MODULE_NAME_CONFLICT, context, caller);
};

export const creationLimitExceeded = (context?: any, caller?: string) => {
  return fail(ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED, context, caller);
};
export const userNoPermission = (context?: any, caller?: string) => {
  return fail(ModuleErrorCodes.USER_NO_PERMISSION, context, caller);
};
