import { fail, ModuleErrorCodes, ok } from "@avuny/utils";

import { IRepository } from "./IRepository.js";

import { FilteredPaginatedList } from "./IQueryService.js";
import { Action, Context, Resource } from "./types.js";
import { IResourcePermission } from "./ServiceGuard/IResourcePermission.js";

export class QueryService {
  private resourcePermission: IResourcePermission;

  constructor({
    resourcePermission,
  }: {
    resourcePermission: IResourcePermission;
  }) {
    this.resourcePermission = resourcePermission;
  }

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
      passResourcePermissionChecker: passResourcePermission,
    }: {
      query: FilteredPaginatedList<TFilter, TOrderBy>;
      context: Context;
      passResourcePermissionChecker?: boolean;
    }) => {
      let canRead;
      if (!passResourcePermission) {
        canRead = await this.resourcePermission.check({
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
      console.log("totalCount:", totalCount);
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

  getOptions = <
    R extends IRepository,
    TFilter extends Parameters<R["findMany"]>[0]["where"],
    TCursor extends Parameters<R["findMany"]>[0]["cursor"],
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
      query: { cursor, take = 100, filters },
      context,
      permissions,
      passResourcePermissionChecker: passResourcePermission,
    }: {
      query: {
        cursor?: TCursor;
        take?: number;
        filters?: TFilter;
      };
      context: Context;
      passResourcePermissionChecker?: boolean;
      permissions: {
        resource: Resource;
        action: Action;
      }[]; // because options could be used with other resources like when creating item and want select unit for it.
    }) => {
      let canRead;

      if (!passResourcePermission) {
        canRead = await this.resourcePermission.check({
          organizationId: context.organizationId,
          userId: context.userId,
          permissions,
        });

        if (!canRead) {
          return fail(
            ModuleErrorCodes.USER_NO_PERMISSION,
            context,
            `${config.moduleName}QueryService.getOptions`,
          );
        }
      }

      const limit = Math.min(take, 500);

      const list = (await repository.findMany({
        where: filters,
        orderBy: { id: "asc" },
        take: limit,
        ...(cursor && {
          cursor,
          skip: 1,
        }),
      })) as Awaited<ReturnType<R["getOptions"]>>;

      const nextCursor =
        list.length === limit ? { id: list[list.length - 1]?.id } : null;

      return ok(
        {
          list,
          nextCursor,
        },
        context,
        `${config.moduleName}QueryService.getOptions`,
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
          `${config.moduleName}QueryService.findById`,
        );
      }

      const record = (await repository.findUnique({
        where: { id },
      })) as Awaited<ReturnType<R["findUnique"]>>;
      if (!record) {
        return fail(
          ModuleErrorCodes.RESOURCE_NOT_FOUND,
          context,
          `${config.moduleName}QueryService.findById`,
        );
      }

      return ok(record, context, `${config.moduleName}QueryService.findById`);
    };
  };
}
