import { fail } from "@avuny/utils";
import { IMutationService } from "../IMutationService.js";
import { IRepository } from "../IRepository.js";
import { Context, Resource } from "../types.js";
import { IResourcePermission } from "./IResourcePermission.js";
import { ServiceGuardErrorCodes } from "./errors/errors.js";

export class MutationServiceGuard<
  R extends IRepository,
  S extends IMutationService<R>,
> {
  constructor(
    private mutationService: S,
    private resourcePermission: IResourcePermission,
  ) {}

  create = async ({
    context,
    data,
    resource,
  }: {
    context: Context;
    data: Parameters<S["create"]>[0]["data"];
    resource: Resource;
  }) => {
    const hasAccess = await this.resourcePermission.check({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "create",
      resource,
    });
    if (!hasAccess) {
      return fail(
        ServiceGuardErrorCodes.ACCESS_DENIED,
        { ...context, resource },
        "MutationServiceGuard.create",
      );
    }
    return await this.mutationService.create({ context, data });
  };

  update = async ({
    context,
    data,
    resource,
    id,
  }: {
    context: Context;
    data: Parameters<S["create"]>[0]["data"];
    id: string;
    resource: Resource;
  }) => {
    const hasAccess = await this.resourcePermission.check({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "update",
      resource,
    });
    if (!hasAccess) {
      return fail(
        ServiceGuardErrorCodes.ACCESS_DENIED,
        { ...context, resource },
        "MutationServiceGuard.update",
      );
    }
    return await this.mutationService.update({ context, data, id });
  };
}
