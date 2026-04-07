import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { mutateOrganizationUserResponseSchema } from "@avuny/shared";
import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";

import { getContext, handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "../../shared.js";
import container from "../../container.js";

import { trans } from "../../intl/Translation.js";

export const deleteOrganizationUserRoute = new OpenAPIHono();
const route = createRoute({
  method: "delete",
  path: "/{id}",
  operationId: "deleteOrganizationUser",
  tags: ["organizationUser"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
  },

  responses: {
    [200]: {
      description: "OrganizationUser have been deleted successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            mutateOrganizationUserResponseSchema.omit({ name: true }),
          ),
        },
      },
    },

    [ModuleErrorResponseMap.USER_NO_PERMISSION.statusCode]: {
      description: "User has no permission to delete organizationUser",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.USER_NO_PERMISSION,
          ]),
        },
      },
    },
    ...globalErrorResponses,
  },
});

deleteOrganizationUserRoute.openapi(route, async (c) => {
  const organizationUserService = container.resolve("organizationUserService");
  const context = getContext(c);
  const errorTrans = trans({ lang: context.lang as "en" | "ar" });
  const { id } = c.req.valid("param");

  const result = await organizationUserService.delete({
    context,
    where: { id },
  });
  const {
    MODULE_CREATION_LIMIT_EXCEEDED,
    RESOURCE_NOT_FOUND,
    MODULE_NAME_CONFLICT,
    ...restModuleErrorResponseMap
  } = ModuleErrorResponseMap;
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: restModuleErrorResponseMap,
    moduleName: "organizationUser",
    errorTrans,
  });
});
