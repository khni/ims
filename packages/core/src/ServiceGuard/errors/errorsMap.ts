import { ErrorMeta } from "@avuny/utils";

import {
  ServiceGuardErrorCodes,
  type ServiceGuardErrorCodesType,
} from "./errors.js";

export const serviceGuardErrorMapping = {
  [ServiceGuardErrorCodes.ACCESS_DENIED]: {
    statusCode: 403,
    responseMessage: "Access Denied",
  },
} as const satisfies Record<ServiceGuardErrorCodesType, ErrorMeta>;
