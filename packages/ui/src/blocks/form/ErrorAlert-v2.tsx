import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/alert";
import { AlertCircle } from "lucide-react";

export type ErrorType = "domain" | "validation" | "system";
// export type SignUp409 = {
//   type: string;
//   success: boolean;
//   code: SignUp409Code;
//   message: string;
// };

export type ApiError<C> = {
  response?: {
    data?: {
      code: C;
      type: string;
      message?: string;
    };
  };
} | null;

export type ErrorAlertProps<C> = {
  error: ApiError<C> | null;
  errorMap?: (code: C) => string;
  errorTitle?: string;
};

export function ErrorAlert<C>({
  error,
  errorMap,
  errorTitle,
}: ErrorAlertProps<C>) {
  const code = error?.response?.data?.code;

  if (!code) return null;

  const err = errorMap?.(code) ?? error.response?.data?.message;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorTitle}</AlertTitle>
      <AlertDescription>{err}</AlertDescription>
    </Alert>
  );
}
