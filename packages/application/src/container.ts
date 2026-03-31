// container.ts

import {
  createContainer,
  asClass,
  InjectionMode,
  AwilixContainer,
  Resolver,
  asValue,
} from "awilix";
import { OrganizationRepository } from "./organization/repositories/organization.repository.js";
import { OrganizationService } from "./organization/services/organization.service.js";
import {
  CreateService,
  ModuleService,
  QueryService,
  UpdateService,
} from "@avuny/core";
import { ActivityLogService } from "./activity-log/ActivityLogService.js";
import { ResourcePermissionChecker } from "./resource-permission/resource-permission-checker.js";
import { OwnerRoleService } from "./role/services/owner-role.service.js";
import { OwnerOrganizationUserService } from "./organization-user/services/owner-organization-user.service.js";
import { RoleRepository } from "./role/repositories/role.repository.js";
import { RoleService } from "./role/services/role.service.js";
import { OrganizationUserRepository } from "./organization-user/repositories/organozation-user.repository.js";
import { OrganizationUserService } from "./organization-user/services/organization-user.service.js";
import { IsOwnerOrganizationUserQuery } from "./organization-user/queries/is-owner-organization-user.query.js";
import { SidebarQueries } from "./sidebar/repositories/sidebar.queries.js";
import { SidebarService } from "./sidebar/services/sidebar.service.js";
import { prisma, PrismaN } from "@avuny/db";
import { ActivityLogRepository } from "./activity-log/ActivityLogRepository.js";
import { UserRepository } from "./user/repositories/user.repository.js";
import { UserService } from "./user/services/user.services.js";
import { organizationUserConfig } from "./organization-user/organization-user.config.js";
import { RoleConfig } from "./role/role.config.js";

function enforceClass<T>(
  c: new (...args: any[]) => T,
): new (...args: any[]) => T {
  return c;
}

function enforceValue<T>(v: T): T {
  return v;
}

function enforceFunction<T extends (...args: any[]) => any>(f: T): T {
  return f;
}
export const appDeps = {
  //infra
  db: asClass(PrismaN),
  activityLogRepository: asClass(ActivityLogRepository).scoped(),
  //core
  createService: asClass(CreateService).scoped(),
  updateService: asClass(UpdateService).scoped(),
  queryService: asClass(QueryService).scoped(),
  moduleService: asClass(ModuleService).transient(),
  activityLog: asClass(ActivityLogService).scoped(),
  resourcePermission: asClass(ResourcePermissionChecker).scoped(),

  //user
  userRepository: asClass(UserRepository).scoped(),
  userService: asClass(UserService).scoped(),

  // organization
  organizationRepository: asClass(OrganizationRepository).scoped(),
  organizationService: asClass(OrganizationService).scoped(),
  // role
  roleRepository: asClass(RoleRepository).scoped(),
  roleService: asClass(RoleService).scoped(),
  ownerRoleService: asClass(OwnerRoleService).scoped(),
  roleConfig: asClass(RoleConfig).singleton(),

  // organization user
  organizationUserRepository: asClass(OrganizationUserRepository).scoped(),
  organizationUserService: asClass(OrganizationUserService).scoped(),
  ownerOrganizationUserService: asClass(OwnerOrganizationUserService).scoped(),
  isOwnerOrganizationUserQuery: asClass(IsOwnerOrganizationUserQuery).scoped(),
  organizationUserConfig: asClass(organizationUserConfig).singleton(),

  //sidebar
  sidebarQueries: asClass(SidebarQueries).scoped(),
  sidebarService: asClass(SidebarService).scoped(),

  //owner role
};
type AppDeps = {
  [K in keyof typeof appDeps]: (typeof appDeps)[K] extends Resolver<infer T>
    ? T
    : never;
};

export type AppContainer = AwilixContainer<AppDeps>;

const container: AppContainer = createContainer({
  injectionMode: InjectionMode.PROXY,
});
container.register(appDeps);

export default container;
