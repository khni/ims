export type Context = {
  userId: string;
  organizationId?: string;
  lang: string;
  requestId: string;
};
export type ServiceContext = Omit<Context, "lang">;

export type Resource = "role" | "user" | "organization";
export type Action = "read" | "update" | "create" | "delete";
