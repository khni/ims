import { ErrorMeta } from "@avuny/utils";
import {
  ItemErrorCode,
  ItemErrorCodeKeys,
} from "./item.error-code.js";

/**
 * Item Error Map
 *
 * Maps error codes → HTTP response metadata
 */
export const ItemErrorMap = {
  /**
   * Duplicate name
   */
  [ItemErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 403,
    responseMessage: "Name is already in use",
  },

  /**
   * Creation limit exceeded
   */
  [ItemErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 403,
    responseMessage:
      "You have reached the maximum number of items allowed in your plan. Please upgrade your plan to create more items.",
  },

  /**
   * Permission denied
   */
  [ItemErrorCode.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage:
      "You do not have permission to perform this action",
  },

  /**
   * Resource not found
   */
  [ItemErrorCode.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "Item not found",
  },

} as const satisfies Record<
  ItemErrorCodeKeys,
  ErrorMeta
>;
