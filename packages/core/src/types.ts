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
  | "item"
  | "invoice"
  | "customer"
  | "supplier"
  | "purchaseOrder"
  | "salesOrder"
  | "warehouse"
  | "organization"
  | "organizationUser"
  | "report";
export type Action =
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "archive"
  | "read"
  | "approve"
  | "reject"
  | "export"
  | "import"
  | "share";

export type FieldRules<T, E> = {
  keys: (keyof T)[];
  errorKey: E;
}[];
