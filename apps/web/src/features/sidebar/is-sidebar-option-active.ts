export const MappedPaths = {
  "organization-users": "user",
  roles: "role",
  items: "item",
  units: "unit",
  "unit-collections": "unitCollection",
  invoices: "invoice",
  customers: "customer",
  suppliers: "supplier",
  purchaseOrders: "purchaseOrder",
  salesOrders: "salesOrder",
  warehouses: "warehouse",
  organizations: "organization",
  reports: "report",
};
type MappedPathKey = keyof typeof MappedPaths;
export const isSidebarOptionActive = (
  pathName: string,
  optionName: string,
): boolean => {
  const segment = pathName
    .split("/")
    .find((seg): seg is MappedPathKey => seg in MappedPaths);

  return segment ? MappedPaths[segment] === optionName : false;
};
