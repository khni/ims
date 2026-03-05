import axios from "axios";
import {
  FacebookAuthConfig,
  Provider,
  SocialAuthProvider,
  SocialTokensResult,
  SocialUserResult,
} from "../interfaces/ISocialAuthProvider.js";

export class FacebookSocialAuthStrategy implements SocialAuthProvider {
  constructor(private facebookAuthConfig: FacebookAuthConfig) {}
  provider: Provider = "facebook";

  async getTokens(code: string): Promise<SocialTokensResult> {
    const params = new URLSearchParams({
      client_id: this.facebookAuthConfig.appId,
      client_secret: this.facebookAuthConfig.appSecret,
      redirect_uri: this.facebookAuthConfig.redirectUri,
      code,
    });
    console.log("Facebook getTokens params:", params.toString());

    const res = await axios.get(
      "https://graph.facebook.com/v6.0/oauth/access_token",
      { params }
    );
    return res.data;
  }

  async getUser(tokens: SocialTokensResult): Promise<SocialUserResult> {
    const res = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email,locale,picture",
        access_token: tokens.access_token,
      },
    });

    const user = res.data;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      pictureUrl: user.picture?.data?.url,
      locale: user.locale,
      verified_email: Boolean(user.email), // only "true" if email is present
      provider: this.provider,
    };
  }
}
