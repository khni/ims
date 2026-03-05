import { LocalAuthService } from "../lib/auth/services/LocalAuthService.js";
import { TokensService } from "../lib/auth/services/TokensService.js";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import {
  LocalLoginInput,
  LocalRegisterInput,
  LocalRegisterWithTransformInput,
} from "../schemas.js";
import { mapAuthResponse } from "../lib/auth/utils.js";
import { fail, ok } from "@avuny/utils";
import { AuthenticatedErrorCodes } from "../lib/auth/errors/errors.js";
import { SocialAuthLogin } from "../lib/auth/social-auth/services/SocialLogin.js";
import { SocialAuthContext } from "../lib/auth/social-auth/services/SocialAuthContext.js";
import { GoogleSocialAuthStrategy } from "../lib/auth/social-auth/services/GoogleAuthStrategy.js";
import {
  Provider,
  SocialUserResult,
} from "../lib/auth/social-auth/interfaces/ISocialAuthProvider.js";
import { User } from "@avuny/db";
import { FacebookSocialAuthStrategy } from "../lib/auth/social-auth/services/FacebookAuthStrategy.js";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("jwtSecret is not defined in .env file");
}
const userRepository = new UserRepository("email");
const localAuthservce = new LocalAuthService(userRepository);

const tokensService = new TokensService(
  new RefreshTokenRepository(),
  "15d",
  jwtSecret,
  "10m",
);

const socialAuthContext = new SocialAuthContext([
  new GoogleSocialAuthStrategy({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  }),
  new FacebookSocialAuthStrategy({
    appId: process.env.FACEBOOK_APP_ID!,
    appSecret: process.env.FACEBOOK_SECRET!,
    redirectUri: process.env.FACEBOOK_REDIRECT_URI!,
  }),
]);
const handleSocialUser = async (user: SocialUserResult) => {
  let _user = await userRepository.findUnique({
    where: {
      identifier: user.email,
    },
  });
  let socialUser: User;
  if (!_user) {
    socialUser = await userRepository.create({
      data: {
        identifier: user.email,
        oauthId: user.id,
        oauthProvider: user.provider,
        name: user.name,
      },
    });
  } else {
    socialUser = await userRepository.update({
      where: {
        identifier: user.email,
      },
      data: {
        oauthId: user.id,
        oauthProvider: user.provider,
      },
    });
  }
  return socialUser;
};
export const socialAuth = new SocialAuthLogin(
  socialAuthContext,
  handleSocialUser,
);
export const signUp = async ({
  identifier,
  name,
  password,
}: LocalRegisterWithTransformInput) => {
  const authResult = await localAuthservce.createUser({
    identifier: identifier.value,
    name,
    password,
  });

  if (!authResult.success) {
    return authResult;
  }

  const tokensResult = await tokensService.issue({
    userId: authResult.data.id,
  });

  return mapAuthResponse(authResult, tokensResult);
};

export const signIn = async ({
  identifier,

  password,
}: LocalLoginInput) => {
  const authResult = await localAuthservce.verifyPassword({
    identifier,
    password,
  });

  if (!authResult.success) {
    return authResult;
  }

  const tokensResult = await tokensService.issue({
    userId: authResult.data.id,
  });

  return mapAuthResponse(authResult, tokensResult);
};

// token may be undefiend or null if it did not attack to header
export const isAuthenticated = (token?: string | null) => {
  if (!token) {
    return fail(AuthenticatedErrorCodes.UNAUTHENTICATED);
  }
  return tokensService.verifyAccessToken(token);
};

export const getUser = async (id: string) => {
  const user = await userRepository.findUnique({ where: { id } });
  if (!user) {
    //this function will be used by isAuthenticated route
    return fail(AuthenticatedErrorCodes.UNAUTHENTICATED);
  }

  return ok({ id: user.id, identifier: user.email, name: user.name });
};

export const logout = async (token: string) => {
  return await tokensService.deleteRefreshToken(token);
};

export const refreshToken = async ({ token }: { token?: string }) => {
  if (!token) {
    return fail(AuthenticatedErrorCodes.AUTH_REFRESH_TOKEN_INVALID);
  }
  const result = await tokensService.verifyRefreshToken({
    token,
  });

  if (!result.success) {
    return result;
  }

  return await tokensService.issue({ userId: result.data.userId });
};

export const socialSignIn = async (code: string, provider: Provider) => {
  const user = await socialAuth.execute(code, provider);
  const tokensResult = await tokensService.issue({
    userId: user.id,
  });

  return mapAuthResponse({ data: user }, tokensResult);
};
