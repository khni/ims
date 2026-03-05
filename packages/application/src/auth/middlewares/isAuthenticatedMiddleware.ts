import { MiddlewareHandler } from "hono";

import { isAuthenticated } from "../services/UserService.js";
import { v4 as uuidv4 } from "uuid";
import { resultToErrorResponse } from "@avuny/utils";
import { authenticatedErrorMapping } from "../lib/auth/errors/errorsMap.js";

export const isAuthenticatedMiddleware: MiddlewareHandler = async (c, next) => {
  // ─────────────────────────────
  // 1. Authenticate user
  // ─────────────────────────────
  const authHeader = c.req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const result = isAuthenticated(token);

  if (!result.success) {
    return c.json(
      resultToErrorResponse(result.error, authenticatedErrorMapping),
      401,
    );
  }

  // ─────────────────────────────
  // 2. Resolve organization context
  // ─────────────────────────────
  const organizationId = c.req.header("X-Organization-Id");

  // ─────────────────────────────
  // 3. Attach request context
  // ─────────────────────────────
  c.set("user", {
    id: result.data.userId,
  });
  console.log("orgId", organizationId);
  c.set("organizationId", organizationId || ""); //<WIP>
  c.set("requestId", uuidv4());

  await next();
};
