"use server";

import { prisma } from "@avuny/db";

export async function createTestUser() {
  const random = Math.floor(Math.random() * 1000000);

  const user = await prisma.user.create({
    data: {
      name: "khaled",
      email: `${random}#gmail.com`,
    },
  });
}
