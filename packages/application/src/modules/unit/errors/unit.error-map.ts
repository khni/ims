import { ErrorMeta } from "@avuny/utils";
import {
  UnitErrorCode,
  UnitErrorCodeKeys,
} from "./unit.error-code.js";

/**
 * Unit Error Map
 *
 * Maps error codes → HTTP response metadata
 */
export const UnitErrorMap = {
  /**
   * Duplicate name
   */
  [UnitErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Name is already in use",
  },

  /**
   * Creation limit exceeded
   */
  [UnitErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 429,
    responseMessage:
      "You have reached the maximum number of units allowed in your plan. Please upgrade your plan to create more units.",
  },

  /**
   * Permission denied
   */
  [UnitErrorCode.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage:
      "You do not have permission to perform this action",
  },

  /**
   * Resource not found
   */
  [UnitErrorCode.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "Unit not found",
  },

} as const satisfies Record<
  UnitErrorCodeKeys,
  ErrorMeta
>;
