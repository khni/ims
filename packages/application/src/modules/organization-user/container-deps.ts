import { asClass } from "awilix";

import { OrganizationUserRepository } from "./repositories/organozation-user.repository.js";
import { OrganizationUserService } from "./services/organization-user.service.js";
import { OwnerOrganizationUserService } from "./services/owner-organization-user.service.js";
import { IsOwnerOrganizationUserQuery } from "./queries/is-owner-organization-user.query.js";
import { organizationUserConfig } from "./organization-user.config.js";

/**
 * OrganizationUser Dependencies
 *
 * Registers:
 * - Repository (data layer)
 * - Service (business logic layer)
 *
 * Lifetime:
 * - scoped → new instance per request (recommended for web apps)
 */
export const organizationUserDeps = {
  organizationUserRepository: asClass(OrganizationUserRepository).scoped(),
  organizationUserService: asClass(OrganizationUserService).scoped(),
  ownerOrganizationUserService: asClass(OwnerOrganizationUserService).scoped(),
  isOwnerOrganizationUserQuery: asClass(IsOwnerOrganizationUserQuery).scoped(),
  organizationUserConfig: asClass(organizationUserConfig).singleton(),
};
