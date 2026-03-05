import bcrypt from "bcryptjs";

import {
  AuthLoginDomainErrorCodes,
  type AuthLoginDomainErrorCodesType,
  AuthSignUpDomainErrorCodes,
  type AuthSignUpDomainErrorCodesType,
} from "../errors/errors.js";
import { UserCreateInput, UserLoginInput } from "../interfaces/types.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import { fail, ok, Result } from "@avuny/utils";

export class LocalAuthService<User extends { hashedPassword?: string | null }> {
  constructor(private userRepository: IUserRepository<User>) {}

  createUser = async ({
    identifier,
    password,
    name,
  }: UserCreateInput): Promise<
    Result<User, AuthSignUpDomainErrorCodesType>
  > => {
    const existingUser = await this.userRepository.findUnique({
      where: { identifier },
    });

    if (existingUser) {
      return fail(AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await this.userRepository.create({
      data: {
        identifier,
        name,
        password: hashedPassword,
      },
    });

    return ok(user);
  };

  verifyPassword = async ({
    identifier,
    password,
  }: UserLoginInput): Promise<Result<User, AuthLoginDomainErrorCodesType>> => {
    const user = await this.userRepository.findUnique({
      where: { identifier },
    });

    if (!user) {
      return fail(AuthLoginDomainErrorCodes.AUTH_LOGIN_INCORRECT_CREDENTIALS);
    }

    if (!user.hashedPassword) {
      return fail(AuthLoginDomainErrorCodes.AUTH_LOGIN_USER_PASSWORD_NOT_SET);
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      return fail(AuthLoginDomainErrorCodes.AUTH_LOGIN_INCORRECT_CREDENTIALS);
    }

    return ok(user);
  };
}
