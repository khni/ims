export type Provider = "google" | "facebook";
export interface SocialUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  pictureUrl: string;
  locale?: string;
  provider: Provider;
}
export interface SocialTokensResult {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

// Strategy Interface
export interface SocialAuthProvider {
  provider: Provider;
  getTokens(code: string): Promise<SocialTokensResult>;
  getUser(tokens: SocialTokensResult): Promise<SocialUserResult>;
}

//google config
export type GoogleAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

//facebook config
export type FacebookAuthConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
};
// Add more providers as needed
// e.g., Twitter, LinkedIn, GitHub, etc.
// Each provider will have its own config type
// and implementation of the SocialAuthProvider interface
