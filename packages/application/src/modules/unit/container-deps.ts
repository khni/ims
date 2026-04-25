import { asClass } from "awilix";

import { UnitRepository } from "./repositories/unit.repository.js";
import { UnitService } from "./services/unit.service.js";

/**
 * Unit Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 */
export const unitDeps = {
  unitRepository: asClass(UnitRepository).scoped(),
  unitService: asClass(UnitService).scoped(),
};
