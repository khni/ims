import { z } from "@avuny/zod";
import {
  ClientErrorStatusCode,
  ContentfulStatusCode,
} from "hono/utils/http-status";
import { Context } from "hono";
import {
  Result,
  resultToErrorResponse,
  resultToSuccessResponse,
} from "@avuny/utils";

export function handleResult<
  T,
  E extends string,
  S extends ContentfulStatusCode,
  SE extends ClientErrorStatusCode,
>({
  c,
  errorMap,
  result,
  successStatus,
  errorTrans,
  onError,
  onSuccess,
}: {
  c: Context;
  result: Result<T, E>;
  successStatus: S;
  errorMap: Record<E, { statusCode: SE; responseMessage: string }>;

  onSuccess?: (result: T) => void;
  onError?: (error: E) => void;
  errorTrans?: (error: E) => string;
}) {
  if (!result.success) {
    const err = resultToErrorResponse(result.error, errorMap);
    onError?.(result.error);
    // ❗ critical: return directly from c.json
    return c.json(
      { ...err.body, message: errorTrans?.(result.error) || err.body.message },
      err.status,
    );
  }
  onSuccess?.(result.data);

  const ok = resultToSuccessResponse(result.data, successStatus);
  return c.json(ok.body, ok.status);
}

const ErrorResponseSchema = z.object({
  message: z.string(),
});

export function mapErrorsToResponses<
  T extends Record<string, { statusCode: number; responseMessage: string }>,
>(errorMap: T) {
  const responses: Record<number, any> = {};

  for (const error of Object.values(errorMap)) {
    responses[error.statusCode] ??= {
      description: "Error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: { message: error.responseMessage },
        },
      },
    };
  }

  return responses;
}
