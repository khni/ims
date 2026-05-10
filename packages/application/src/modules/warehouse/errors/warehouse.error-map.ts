import { ErrorMeta } from "@avuny/utils";
import {
  WarehouseErrorCode,
  WarehouseErrorCodeKeys,
} from "./warehouse.error-code.js";

/**
 * Warehouse Error Map
 *
 * Maps error codes → HTTP response metadata
 */
export const WarehouseErrorMap = {
  /**
   * Duplicate name
   */
  [WarehouseErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Name is already in use",
  },

  /**
   * Creation limit exceeded
   */
  [WarehouseErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 429,
    responseMessage:
      "You have reached the maximum number of warehouses allowed in your plan. Please upgrade your plan to create more warehouses.",
  },

  /**
   * Permission denied
   */
  [WarehouseErrorCode.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage:
      "You do not have permission to perform this action",
  },

  /**
   * Resource not found
   */
  [WarehouseErrorCode.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "Warehouse not found",
  },

} as const satisfies Record<
  WarehouseErrorCodeKeys,
  ErrorMeta
>;
