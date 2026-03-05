import { FindUserWhere, UserCreateInput } from "./types.js";

export interface IUserRepository<User> {
  findUnique({ where }: { where: FindUserWhere }): Promise<User | null>;
  create({ data }: { data: UserCreateInput }): Promise<User>;
}
