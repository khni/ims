import { asClass } from "awilix";

import { ItemRepository } from "./repositories/item.repository.js";
import { ItemService } from "./services/item.service.js";

/**
 * Item Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 */
export const itemDeps = {
  itemRepository: asClass(ItemRepository).scoped(),
  itemService: asClass(ItemService).scoped(),
};
