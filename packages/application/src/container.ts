// container.ts

import {
  createContainer,
  asClass,
  asValue,
  asFunction,
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
