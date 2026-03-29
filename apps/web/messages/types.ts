import commonMessages from "./common/en.json";
import authMessages from "../src/features/auth/translations/messages/en.json";
import organizationMessages from "../src/features/organization/translations/messages/en.json";
import organizationUserMessages from "../src/features/organizationUser/translations/messages/en.json";
import roleMessages from "../src/features/role/translations/messages/en.json";

export type Messages = typeof commonMessages &
  typeof authMessages &
  typeof organizationMessages &
  typeof organizationUserMessages &
  typeof roleMessages;

export const messages: Messages = {
  ...commonMessages,
  ...authMessages,
  ...organizationMessages,
  ...organizationUserMessages,
  ...roleMessages
};
