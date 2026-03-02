import { Ok } from "@avuny/utils";
import { IRepository } from "./IRepository.js";
import { Context } from "./types.js";

export type FilteredPaginatedList<IFilters, TOrderBy> = {
  page?: number;
  pageSize?: number;
  orderBy?: TOrderBy;
  filters: IFilters;
};

// <WIP>
export type CursorPaginatedListByName<IFilters> = {
  limit?: number;
  cursor?: {
    name: string;
    id: string;
  };
  filters: IFilters;
  context: {
    userId: string;
    requestId: string;
    organizationId: string;
  };
};

export interface IQueryService<R extends IRepository> {
  filteredPaginatedList: <
    TFilter extends Parameters<R["findMany"]>[0]["where"],
    TOrderBy extends Parameters<R["findMany"]>[0]["orderBy"],
  >(
    params: FilteredPaginatedList<TFilter, TOrderBy>,
  ) => Promise<
    Ok<{
      list: Awaited<ReturnType<R["findMany"]>>;
      totalCount: number;
      totalPages: number;
    }>
  >;

  findById: (params: {
    id: string;
    context: Context;
  }) => Promise<Ok<Awaited<ReturnType<R["findUnique"]>>>>;
}
