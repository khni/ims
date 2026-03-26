import { defineErrorMapping } from "@avuny/utils";
import {
  OrganizationErrorCode,
  OrganizationErrorCodeKeys,
} from "./errorCode.js";

const organizationErrorMap = defineErrorMapping<OrganizationErrorCodeKeys>({
  [OrganizationErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 403,
    responseMessage: "Name is already in use",
  },

  [OrganizationErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 403,
    responseMessage:
      "You have reached the maximum number of organizations allowed in your plan. Please upgrade your plan to create more organizations.",
  },

  [OrganizationErrorCode.USER_NO_PERMISSION]: {
    statusCode: 409,
    responseMessage: "The user does not have permission to perform this action",
  },
  [OrganizationErrorCode.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "Resource is not found",
  },
});
