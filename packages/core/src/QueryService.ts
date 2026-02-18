import { ok } from "@avuny/utils";

import { IRepository } from "./IRepository.js";

import { FilteredPaginatedList } from "./IQueryService.js";
import { Resource } from "./types.js";

export class QueryService<R extends IRepository> {
  constructor(
    private repository: R,

    private config: {
      moduleName: Resource;
    },
  ) {}

  filteredPaginatedList = async <
    TFilter extends Parameters<R["findMany"]>[0]["where"],
    TOrderBy extends Parameters<R["findMany"]>[0]["orderBy"],
  >({
    context,
    page = 0,
    pageSize = 499,
    filters,
    orderBy,
  }: FilteredPaginatedList<TFilter, TOrderBy>) => {
    let limit: number;
    if (pageSize > 500) {
      limit = 500;
    } else {
      limit = pageSize;
    }
    const offset = page * pageSize;

    const totalCount = await this.repository.count({
      where: filters,
    });
    const list = (await this.repository.findMany({
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
      `${this.config.moduleName}QueryService.filteredPaginatedList`,
    );
  };

  findById = async (params: {
    id: string;
    context: { userId: string; requestId: string; organizationId: string };
  }) => {
    const { context, id } = params;

    const record = (await this.repository.findUnique({
      where: { id },
    })) as Awaited<ReturnType<R["findUnique"]>>;

    return ok(
      record,
      context,
      `${this.config.moduleName}QueryService.findById`,
    );
  };
}
