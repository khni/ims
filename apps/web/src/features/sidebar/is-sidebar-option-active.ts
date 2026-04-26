export const MappedPaths = {
  "organization-users": "user",
  roles: "role",
  items: "item",
  units: "unit",
  unitCollections: "unitCollection",
  invoices: "invoice",
  customers: "customer",
  suppliers: "supplier",
  purchaseOrders: "purchaseOrder",
  salesOrders: "salesOrder",
  warehouses: "warehouse",
  organizations: "organization",
  reports: "report",
} as const;
type MappedPathKey = keyof typeof MappedPaths;
export const isSidebarOptionActive = (
  pathName: string,
  optionName: string,
): boolean => {
  const currentSection = pathName
    .split("/")
    .filter(Boolean)
    .pop()! as MappedPathKey;

  return MappedPaths[currentSection] === optionName;
};
