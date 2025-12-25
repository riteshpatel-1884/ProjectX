"use server";

import { prisma } from "@/lib/prisma";

export async function getRankedUsers(page: number, limit = 10) {
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    where: {
      rank: { not: null },
    },
    orderBy: {
      rank: "asc",
    },
    skip,
    take: limit,
  });

  return users;
}
