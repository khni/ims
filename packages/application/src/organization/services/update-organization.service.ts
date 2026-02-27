import { UpdateService } from "@avuny/core";
import { organizationRepository } from "../factory.js";
import { activityLogService } from "../../factory.js";
import { OrganizationErrorCode } from "../errors/errorCode.js";
import { OrganizationRepository } from "../repositories/organization.repository.js";
import { CreateOrganizationBody } from "../types.js";

export const updateOrganization = new UpdateService<
  OrganizationRepository,
  CreateOrganizationBody & { ownerId: string }
>(organizationRepository, {
  moduleName: "organization",
}).update({
  activityLog: activityLogService,

  uniqueChecker: [
    {
      keys: ["name", "ownerId"],
      errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
    },
  ],
});
