export type Context = {
  userId: string;
  organizationId?: string;
  lang: string;
  requestId: string;
};
export type ServiceContext = Omit<Context, "lang">;

export type Resource =
  | "user"
  | "role"
  | "organization"
  | "item"
  | "invoice"
  | "customer"
  | "supplier"
  | "purchase_order"
  | "sales_order";
export type Action = "create" | "update" | "delete" | "restore" | "archive";
