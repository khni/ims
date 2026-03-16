import { IOAuthURLStrategy } from "@workspace/ui/lib/social-login/url/IOAuthURLStrategy.js";

export class GoogleOAuthURLStrategy implements IOAuthURLStrategy {
  private rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  constructor(
    private clientId: string,
    private redirectUri: string
  ) {}

  getAuthURL(overrides: Record<string, string> = {}): string {
    const defaultOptions: Record<string, string> = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const options = { ...defaultOptions, ...overrides };
    const qs = new URLSearchParams(options);
    return `${this.rootUrl}?${qs.toString()}`;
  }
}
