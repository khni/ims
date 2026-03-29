import { DB } from "@avuny/db";
import { IUserRepository } from "../interfaces/user.repository.interface.js";

export class UserRepository implements IUserRepository {
  private readonly db: DB;

  constructor({ db }: { db: DB }) {
    this.db = db;
  }

  findByIdentifier = async (identifier: string) => {
    return await this.db.user.findUnique({
      where: { email: identifier },
      select: { id: true, email: true, name: true },
    });
  };
}
