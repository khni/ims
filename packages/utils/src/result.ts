export type Ok<T> = {
  success: true;
  data: T;
};

export type Fail<E = string> = {
  success: false;
  error: E;
};

export type Result<T, E = string> = Ok<T> | Fail<E>;

/**
 * Result constructors
 * Prevents boolean widening and enforces correctness
 */
export const ok = <T>(data: T, context?: any, caller?: string): Ok<T> => {
  console.log("ok data:", context, caller, data);
  return {
    success: true,
    data,
  };
};

export const fail = <E>(error: E, context?: any, caller?: string): Fail<E> => {
  console.log("business logic error:", context, caller, error);
  return {
    success: false,
    error,
  };
};
