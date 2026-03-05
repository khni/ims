import axios from "axios";
import qs from "qs";
import {
  GoogleAuthConfig,
  Provider,
  SocialAuthProvider,
  SocialTokensResult,
  SocialUserResult,
} from "../interfaces/ISocialAuthProvider.js";

export class GoogleSocialAuthStrategy implements SocialAuthProvider {
  constructor(private googleAuthConfig: GoogleAuthConfig) {
    console.log(" GOOGLE_REDIRECT_URI:", googleAuthConfig.redirectUri);
  }
  provider: Provider = "google";

  async getTokens(code: string): Promise<SocialTokensResult> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: this.googleAuthConfig.clientId,
      client_secret: this.googleAuthConfig.clientSecret,
      redirect_uri: this.googleAuthConfig.redirectUri,
      grant_type: "authorization_code",
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify(values),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch Google tokens");
    }

    return await res.json();
  }

  async getUser(tokens: SocialTokensResult): Promise<SocialUserResult> {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${tokens.id_token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error?.message || "Failed to fetch Google user"
      );
    }
    const user = await res.json();
    console.log(user, "google userinfo");
    return {
      id: user.sub,
      email: user.email,
      name: user.name,
      pictureUrl: user.picture,
      locale: user.locale,
      verified_email: user.verified_email, // from Google directly
      provider: this.provider,
    };
  }
}
