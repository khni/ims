import { fail, ModuleErrorCodes, ok } from "@avuny/utils";

import { IRepository } from "./IRepository.js";

import { FilteredPaginatedList } from "./IQueryService.js";
import { Context, Resource } from "./types.js";
import { IResourcePermission } from "./ServiceGuard/IResourcePermission.js";

export class QueryService {
  constructor(private resourcePermission: IResourcePermission) {}

  filteredPaginatedList = <
    R extends IRepository,
    TFilter extends Parameters<R["findMany"]>[0]["where"],
    TOrderBy extends Parameters<R["findMany"]>[0]["orderBy"],
  >({
    config,
    repository,
  }: {
    config: {
      moduleName: Resource;
    };
    repository: R;
  }) => {
    return async ({
      query: { page = 0, pageSize = 499, filters, orderBy },
      context,
    }: {
      query: FilteredPaginatedList<TFilter, TOrderBy>;
      context: Context;
    }) => {
      const canRead = await this.resourcePermission.check({
        action: "read",
        organizationId: context.organizationId,
        userId: context.userId,
        resource: config.moduleName,
      });
      if (!canRead) {
        return fail(
          ModuleErrorCodes.USER_NO_PERMISSION,
          context,
          `${config.moduleName}QueryService.filteredPaginatedList`,
        );
      }
      let limit: number;
      if (pageSize > 500) {
        limit = 500;
      } else {
        limit = pageSize;
      }
      const offset = page * pageSize;

      const totalCount = await repository.count({
        where: filters,
      });
      const list = (await repository.findMany({
        skip: offset,
        where: filters,
        orderBy: orderBy,
        take: limit,
      })) as Awaited<ReturnType<R["findMany"]>>;

      return ok(
        {
          list,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        context,
        `${config.moduleName}QueryService.filteredPaginatedList`,
      );
    };
  };

  findById = <R extends IRepository>(options: {
    config: {
      moduleName: Resource;
    };
    repository: R;
  }) => {
    return async (params: { id: string; context: Context }) => {
      const { repository, config } = options;
      const { context, id } = params;
      const canRead = await this.resourcePermission.check({
        action: "read",
        organizationId: context.organizationId,
        userId: context.userId,
        resource: config.moduleName,
      });
      if (!canRead) {
        return fail(
          ModuleErrorCodes.USER_NO_PERMISSION,
          context,
          `${config.moduleName}QueryService.filteredPaginatedList`,
        );
      }

      const record = (await repository.findUnique({
        where: { id },
      })) as Awaited<ReturnType<R["findUnique"]>>;

      return ok(record, context, `${config.moduleName}QueryService.findById`);
    };
  };
}
