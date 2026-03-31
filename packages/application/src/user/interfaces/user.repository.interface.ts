type User = {
  id: string;
  email: string;
  name: string;
};
export interface IUserRepository {
  findByIdentifier: (identifier: string) => Promise<User | null>;
  findById: (userId: string) => Promise<User | null>;
}
