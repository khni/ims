import { asClass } from "awilix";

import { WarehouseRepository } from "./repositories/warehouse.repository.js";
import { WarehouseService } from "./services/warehouse.service.js";

/**
 * Warehouse Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 */
export const warehouseDeps = {
  warehouseRepository: asClass(WarehouseRepository).scoped(),
  warehouseService: asClass(WarehouseService).scoped(),
};
