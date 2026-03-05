declare module "hono" {
  interface ContextVariableMap {
    user: { id: string };
    requestId: string;
    organizationId: string;
  }
}
