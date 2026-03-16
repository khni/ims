import { IOAuthURLStrategy } from "@workspace/ui/lib/social-login/url/IOAuthURLStrategy.js";

export class OAuthContext {
  constructor(private strategy: IOAuthURLStrategy) {}

  setStrategy(strategy: IOAuthURLStrategy) {
    this.strategy = strategy;
  }

  buildAuthURL(overrides?: Record<string, string>): string {
    return this.strategy.getAuthURL(overrides);
  }
}
