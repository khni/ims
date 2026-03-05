import {
  Provider,
  SocialUserResult,
} from "../interfaces/ISocialAuthProvider.js";
import { SocialAuthContext } from "./SocialAuthContext.js";

export class SocialAuthLogin<User> {
  constructor(
    private socialAuthContext: SocialAuthContext,
    private handleSocialUser: (user: SocialUserResult) => Promise<User>
  ) {}

  async execute(code: string, provider: Provider) {
    const { user } = await this.socialAuthContext.authenticate(code, provider);

    return await this.handleSocialUser(user);
  }
}
