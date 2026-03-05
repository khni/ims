import {
  Provider,
  SocialAuthProvider,
  SocialTokensResult,
  SocialUserResult,
} from "../interfaces/ISocialAuthProvider.js";

export class SocialAuthContext {
  constructor(private socialAuthProviders: SocialAuthProvider[]) {}

  private getStrategy = (provider: Provider) => {
    const strategy = this.socialAuthProviders.find(
      (socialAuthProvider) => socialAuthProvider.provider === provider
    );
    if (strategy) {
      return strategy;
    } else {
      throw new Error("No strategy found for this provider type");
    }
  };
  async authenticate(
    code: string,
    provider: Provider
  ): Promise<{ tokens: SocialTokensResult; user: SocialUserResult }> {
    const strategy = this.getStrategy(provider);
    const tokens = await strategy.getTokens(code);
    console.log(tokens, "tokens-socialauthcontext");
    const user = await strategy.getUser(tokens);
    return { tokens, user };
  }
}
