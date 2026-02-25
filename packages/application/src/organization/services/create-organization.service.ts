import { CreateService } from "@avuny/core";
import { organizationRepository } from "../factory.js";
import { activityLogService } from "../../factory.js";

export const createOrganization = new CreateService(organizationRepository, {
  moduleName: "organization",
  creationLimit: 10,
}).create({ activityLog: activityLogService });
