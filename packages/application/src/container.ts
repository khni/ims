// container.ts

import {
  createContainer,
  asClass,
  InjectionMode,
  AwilixContainer,
  Resolver,
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
  //core
  createService: asClass(CreateService).scoped(),
  updateService: asClass(UpdateService).scoped(),
  queryService: asClass(QueryService).scoped(),
  moduleService: asClass(ModuleService).scoped(),
  activityLog: asClass(ActivityLogService).scoped(),
  resourcePermission: asClass(ResourcePermissionChecker).scoped(),
  // organization
  organizationRepository: asClass(OrganizationRepository).scoped(),
  organizationService: asClass(OrganizationService).scoped(),
  // role
  roleRepository: asClass(RoleRepository).scoped(),
  roleService: asClass(RoleService).scoped(),
  ownerRoleService: asClass(OwnerRoleService).scoped(),

  // organization user
  organizationUserRepository: asClass(OrganizationUserRepository).scoped(),
  organizationUserService: asClass(OrganizationUserService).scoped(),
  ownerOrganizationUserService: asClass(OwnerOrganizationUserService).scoped(),

  //owner role
};
type AppDeps = {
  [K in keyof typeof appDeps]: (typeof appDeps)[K] extends Resolver<infer T>
    ? T
    : never;
};

export type AppContainer = AwilixContainer<AppDeps>;

const container: AppContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});
container.register(appDeps);

export default container;
