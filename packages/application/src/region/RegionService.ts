import { PrismaClient } from "@avuny/db";

export class RegionQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async countryList() {
    return await this.prisma.country.findMany({
      select: {
        id: true,
        name: true,
        native: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async stateList(countryId: string) {
    return await this.prisma.state.findMany({
      select: {
        id: true,
        name: true,
        native: true,
      },
      where: { countryId },
      orderBy: { name: "asc" },
    });
  }
}
