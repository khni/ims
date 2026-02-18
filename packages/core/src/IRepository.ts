// export type WhereUniqueInput =
//   | { id: string }
//   | { organizationId_name: { name: string; organizationId: string } };
// export interface IBaseRepository<Tx = unknown> {
//   create<TData, ReturnType extends { id: string }>(params: {
//     data: TData;
//     tx?: Tx;
//   }): Promise<ReturnType>;
//   findUnique<TWhereUniqueInput, ReturnType extends { id: string }>(params: {
//     where: TWhereUniqueInput;
//     tx?: Tx;
//   }): Promise<ReturnType | null>;
//   update<TData, ReturnType extends { id: string }>(params: {
//     data: TData;
//     where: { id: string };
//     tx?: Tx;
//   }): Promise<ReturnType>;
//   count<RoleWhereInput>(
//     params?:
//       | {
//           where?: RoleWhereInput | undefined;
//           tx?: Tx;
//         }
//       | undefined,
//   ): Promise<number>;
//   createTransaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T>;
// }

export interface IRepository<
  Tx = unknown,
  TEntity extends { id: string } = { id: string },
  TCreateInput = unknown,
  TUpdateInput = unknown,
  TWhereUnique = unknown,
  TWhere = unknown,
  TCreateReturnType extends { id: string } = {
    id: string;
  },
  TUpdateReturnType extends { id: string } = {
    id: string;
  },
  TFindManyReturnType = { id: string }[],
> {
  create(params: { data: TCreateInput; tx?: Tx }): Promise<TCreateReturnType>;

  findUnique(params: { where: TWhereUnique; tx?: Tx }): Promise<TEntity | null>;
  find(params: {
    where: Partial<TCreateInput>;
    tx?: Tx;
  }): Promise<TEntity | null>;
  findMany(params: {
    where?: TWhere;
    orderBy?: Partial<Record<keyof TEntity, "asc" | "desc">>;
    skip?: number;
    take?: number;
    tx?: Tx;
  }): Promise<TFindManyReturnType>;

  update(params: {
    data: TUpdateInput;
    where: TWhereUnique;
    tx?: Tx;
  }): Promise<TUpdateReturnType>;

  count(params?: { where?: TWhere; tx?: Tx }): Promise<number>;

  createTransaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T>;
}
