import { Messages } from "messages/types";

declare module "next-intl" {
  interface AppConfig {
    Messages: Messages;
  }
}

export type User = {
  name: string;
  identifier: string;
  avatar?: string | undefined;
};
