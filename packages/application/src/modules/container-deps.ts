import { itemDeps } from "./item/container-deps.js";

/**
 * Aggregated Module Dependencies
 *
 * Combines all feature deps into a single object
 * to be registered in the DI container.
 */
export const moduleDeps = {
  ...itemDeps,
};
