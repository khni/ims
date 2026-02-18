import type { ErrorHandler } from "hono";

export const onError: ErrorHandler = (err, c) => {
  console.error(err); // log for observability

  return c.json(
    {
      success: false,
      type: "server",
      code: "SERVER_ERROR",
      message: err.message || "Internal server error",
    },
    500
  );
};
