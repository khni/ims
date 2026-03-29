import path from "path";

export const ROOT = path.resolve(__dirname, "../../../");
export const WEB_ROOT = path.join(ROOT, "apps/web");
export const WEB_SRC = path.join(WEB_ROOT, "src");

export const FEATURES_DIR = path.join(WEB_SRC, "features");
export const MESSAGES_ROOT = path.join(WEB_ROOT, "messages");

export const DIRS = {
  mutation: "mutation",
  translations: "translations",
  messages: "messages",
  hooks: "hooks",
  list: "list",
} as const;
