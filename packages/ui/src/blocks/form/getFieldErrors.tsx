import { ErrorResponse } from "@khni/error-handler";

export const getFieldErrors = (name: string, errorResponse?: ErrorResponse) => {
  if (errorResponse?.errorType !== "InputValidation") return null;

  const fieldErrors = errorResponse.error.errors.find(
    (er) => er.field === name
  )?.messages;

  if (!fieldErrors || fieldErrors.length === 0) return null;

  return (
    <div className="mt-1 space-y-1">
      {fieldErrors.map((msg, idx) => (
        <p key={idx} className="text-sm text-destructive">
          {msg}
        </p>
      ))}
    </div>
  );
};
