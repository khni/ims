export type UserCreateInput = {
  identifier: string;
  password: string;
  name: string;
};
export type UserLoginInput = {
  identifier: string;
  password: string;
};
export type FindUserWhere = { id: string } | { identifier: string };
