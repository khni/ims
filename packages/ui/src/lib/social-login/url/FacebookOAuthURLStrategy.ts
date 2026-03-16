import { IOAuthURLStrategy } from "@workspace/ui/lib/social-login/url/IOAuthURLStrategy.js";

export class FacebookOAuthURLStrategy implements IOAuthURLStrategy {
  private rootUrl = "https://www.facebook.com/v16.0/dialog/oauth";

  constructor(
    private clientId: string,
    private redirectUri: string
  ) {}

  getAuthURL(overrides: Record<string, string> = {}): string {
    const defaultOptions: Record<string, string> = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: ["email", "public_profile"].join(","), // FB uses commas
      auth_type: "rerequest",
    };

    const options = { ...defaultOptions, ...overrides };
    const qs = new URLSearchParams(options);
    return `${this.rootUrl}?${qs.toString()}`;
  }
}
