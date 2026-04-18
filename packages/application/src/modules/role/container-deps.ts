import { asClass } from "awilix";

import { RoleRepository } from "./repositories/role.repository.js";
import { RoleService } from "./services/role.service.js";
import { OwnerRoleService } from "./services/owner-role.service.js";
import { RoleConfig } from "./role.config.js";

/**
 * Role Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 * - config is singleton since it doesn't hold state and can be shared across requests
 */
export const roleDeps = {
  roleRepository: asClass(RoleRepository).scoped(),
  roleService: asClass(RoleService).scoped(),
  ownerRoleService: asClass(OwnerRoleService).scoped(),
  roleConfig: asClass(RoleConfig).singleton(),
};
