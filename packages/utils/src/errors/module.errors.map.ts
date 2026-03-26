import { ErrorMeta } from "../response.js";
import { ModuleErrorCode, ModuleErrorCodes } from "./module.errors.js";
export const ModuleErrorResponseMap = {
  [ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 429, //  429 if this is rate/quota based
    responseMessage: "Module creation limit exceeded",
  },
  [ModuleErrorCodes.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Module name already exists",
  },

  [ModuleErrorCodes.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage: "User has no permission",
  },
  [ModuleErrorCodes.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "Resource is not found",
  },
} as const satisfies Record<ModuleErrorCode, ErrorMeta>;
