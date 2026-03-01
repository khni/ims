import { CreateService } from "./CreateService.js";
import { IActivityLogService } from "./IActivityLogService.js";
import { IResourcePermission } from "./index.js";

export class ModuleService {
  constructor(private createService: CreateService) {}

  create = async () => {};
}
