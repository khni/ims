import { itemDeps } from "./item/container-deps.js";
import { organizationUserDeps } from "./organization-user/container-deps.js";
import { roleDeps } from "./role/container-deps.js";
import { unitDeps } from "./unit/container-deps.js";
import { unitCollectionDeps } from "./unit-collection/container-deps.js";
import { warehouseDeps } from "./warehouse/container-deps.js";

/**
 * Aggregated Module Dependencies
 *
 * Combines all feature deps into a single object
 * to be registered in the DI container.
 */
export const moduleDeps = {
  ...itemDeps,
  ...organizationUserDeps,
  ...roleDeps,
  ...unitDeps,
  ...unitCollectionDeps,
  ...warehouseDeps,
};
