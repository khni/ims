import { defineErrorMapping } from "@avuny/utils";
import { RoleErrorCode, RoleErrorCodeKeys } from "./errorCode.js";

const roleErrorMap = defineErrorMapping<RoleErrorCodeKeys>({
  [RoleErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 403,
    responseMessage: "Name is already in use",
  },

  [RoleErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 403,
    responseMessage:
      "You have reached the maximum number of roles allowed in your plan. Please upgrade your plan to create more roles.",
  },

  [RoleErrorCode.USER_NO_PERMISSION]: {
    statusCode: 409,
    responseMessage: "The user does not have permission to perform this action",
  },
});
