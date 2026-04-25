import { asClass } from "awilix";

import { UnitCollectionRepository } from "./repositories/unit-collection.repository.js";
import { UnitCollectionService } from "./services/unit-collection.service.js";

/**
 * UnitCollection Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 */
export const unitCollectionDeps = {
  unitCollectionRepository: asClass(UnitCollectionRepository).scoped(),
  unitCollectionService: asClass(UnitCollectionService).scoped(),
};
