import { ErrorMeta } from "@avuny/utils";
import {
  UnitCollectionErrorCode,
  UnitCollectionErrorCodeKeys,
} from "./unit-collection.error-code.js";

/**
 * UnitCollection Error Map
 *
 * Maps error codes → HTTP response metadata
 */
export const UnitCollectionErrorMap = {
  /**
   * Duplicate name
   */
  [UnitCollectionErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Name is already in use",
  },

  /**
   * Creation limit exceeded
   */
  [UnitCollectionErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 429,
    responseMessage:
      "You have reached the maximum number of unitCollections allowed in your plan. Please upgrade your plan to create more unitCollections.",
  },

  /**
   * Permission denied
   */
  [UnitCollectionErrorCode.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage:
      "You do not have permission to perform this action",
  },

  /**
   * Resource not found
   */
  [UnitCollectionErrorCode.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "UnitCollection not found",
  },

} as const satisfies Record<
  UnitCollectionErrorCodeKeys,
  ErrorMeta
>;
