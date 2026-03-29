export interface IUserService {
  findByIdentifier: (identifier: string) => Promise<{
    id: string;
    email: string;
    name: string;
  } | null>;
}
