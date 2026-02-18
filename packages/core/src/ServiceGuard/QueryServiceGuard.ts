import { fail } from "@avuny/utils";
import { IRepository } from "../IRepository.js";
import { Context, Resource } from "../types.js";
import { IResourcePermission } from "./IResourcePermission.js";
import { ServiceGuardErrorCodes } from "./errors/errors.js";
import { FilteredPaginatedList, IQueryService } from "../IQueryService.js";

export class QueryServiceGuard<
  R extends IRepository,
  S extends IQueryService<R>,
> {
  constructor(
    private queryService: S,
    private resourcePermission: IResourcePermission,
  ) {}

  findById = async ({
    context,
    id,
    resource,
  }: {
    context: Context;
    id: string;
    resource: Resource;
  }) => {
    const hasAccess = await this.resourcePermission.check({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "read",
      resource,
    });
    if (!hasAccess) {
      return fail(
        ServiceGuardErrorCodes.ACCESS_DENIED,
        { ...context, resource },
        "QueryServiceGuard.findById",
      );
    }
    return await this.queryService.findById({ context, id });
  };

  filteredPaginatedList = async <
    TFilter extends Parameters<R["findMany"]>[0]["where"],
    TOrderBy extends Parameters<R["findMany"]>[0]["orderBy"],
  >(
    params: FilteredPaginatedList<TFilter, TOrderBy> & { resource: Resource },
  ) => {
    const { context, resource, ...restParams } = params;
    const hasAccess = await this.resourcePermission.check({
      organizationId: context.organizationId,
      userId: context.userId,
      action: "read",
      resource,
    });
    if (!hasAccess) {
      return fail(
        ServiceGuardErrorCodes.ACCESS_DENIED,
        { ...context, resource },
        "QueryServiceGuard.filteredPaginatedList",
      );
    }
    return await this.queryService.filteredPaginatedList({
      ...restParams,
      context,
    });
  };
}
