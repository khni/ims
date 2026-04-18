import { Context } from "../../../types";

export function errorMapTemplate({
  featurePascal,
  featureCamel,
  kebabCase,
}: Context) {
  return `import { ErrorMeta } from "@avuny/utils";
import {
  ${featurePascal}ErrorCode,
  ${featurePascal}ErrorCodeKeys,
} from "./${kebabCase}.error-code.js";

/**
 * ${featurePascal} Error Map
 *
 * Maps error codes → HTTP response metadata
 */
export const ${featurePascal}ErrorMap = {
  /**
   * Duplicate name
   */
  [${featurePascal}ErrorCode.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Name is already in use",
  },

  /**
   * Creation limit exceeded
   */
  [${featurePascal}ErrorCode.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 429,
    responseMessage:
      "You have reached the maximum number of ${featureCamel}s allowed in your plan. Please upgrade your plan to create more ${featureCamel}s.",
  },

  /**
   * Permission denied
   */
  [${featurePascal}ErrorCode.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage:
      "You do not have permission to perform this action",
  },

  /**
   * Resource not found
   */
  [${featurePascal}ErrorCode.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    responseMessage: "${featurePascal} not found",
  },

} as const satisfies Record<
  ${featurePascal}ErrorCodeKeys,
  ErrorMeta
>;
`;
}
