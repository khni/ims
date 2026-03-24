import {
  ResourceName,
  SidebarHeadingType,
  SidebarOption,
} from "@avuny/db/types";
import { IIsOwnerOrganizationUserQuery } from "../../shared/is-owner-oganization-user.query.interface.js";
import { SidebarQueries } from "../repositories/sidebar.queries.js";
import { SidebarItem } from "../types.js";
import { trans } from "../../intl/Translation.js";

// type SidebarItem = {
//   id: string;
//   name: SidebarHeadingType;
//   icon?: string | null;
//   options: {
//     id: string;
//     name: ResourceName;
//     icon: string | null;
//     path?: string;
//   }[];
// };

export class SidebarService {
  constructor(
    private readonly sidebarQueries: SidebarQueries,
    private isOwnerOrganizationUserQuery: IIsOwnerOrganizationUserQuery,
  ) {}

  private fetch = async (params: {
    organizationId: string;
    userId: string;
  }) => {
    const { organizationId, userId } = params;

    // 1️⃣ Check FULL_ACCESS
    const hasFullAccess = await this.isOwnerOrganizationUserQuery.check({
      query: { organizationId, userId },
    });

    // 2️⃣ FULL ACCESS → return everything
    if (hasFullAccess) {
      return this.sidebarQueries.getAllSidebarOptions();
    }

    // 3️⃣ NORMAL USER → filtered sidebar
    return this.sidebarQueries.getPermittedSidebarOptions({
      organizationId,
      userId,
    });
  };
  get = async (params: {
    organizationId: string;
    userId: string;
    lang: string;
  }) => {
    const { organizationId, userId, lang } = params;
    const t = trans({ lang: lang as "en" | "ar" });
    const map = new Map<string, SidebarItem>();
    const data = await this.fetch({ organizationId, userId });
    for (const item of data) {
      const headingId = item.sidebarHeadingId;

      if (!map.has(headingId)) {
        map.set(headingId, {
          id: headingId,
          name: t(`sidebar:sidebarHeadings.${item.sidebarHeading.name}`),
          icon: item.icon ?? null,
          options: [],
        });
      }

      map.get(headingId)!.options.push({
        id: item.id,
        name: t(`sidebar:sidebarOptions.${item.name}`),
        icon: item.icon,
        path: item.path,
      });
    }

    return Array.from(map.values());
  };
}
