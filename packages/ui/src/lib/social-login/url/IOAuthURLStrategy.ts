export interface IOAuthURLStrategy {
  getAuthURL(overrides?: Record<string, string>): string;
}
