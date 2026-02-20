import "hono"; // needed so TS loads this file for module augmentation

declare module "hono" {
  interface ContextVariableMap {
    requestId: string;
    organizationId: string;
    user: { id: string };
    lang: "en" | "ar";
  }
}
