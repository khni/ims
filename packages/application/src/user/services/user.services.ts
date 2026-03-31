import { IUserRepository } from "../interfaces/user.repository.interface.js";
import { IUserService } from "../interfaces/user.service.interface.js";

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  findByIdentifier = async (identifier: string) => {
    return await this.userRepository.findByIdentifier(identifier);
  };
  findById = async (userId: string) => {
    return await this.userRepository.findById(userId);
  };
}
