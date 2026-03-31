type User = {
  id: string;
  email: string;
  name: string;
};
export interface IUserService {
  findByIdentifier: (identifier: string) => Promise<User | null>;
  findById: (userId: string) => Promise<User | null>;
}
