// Fetch user data from clerk to postgres
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUserWithDB() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  const clerkUserId = clerkUser.id;
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

  await prisma.user.upsert({
    where: { clerkUserId },
    update: {
      email,
      name,
    },
    create: {
      clerkUserId,
      email,
      name,
      joinedAt: new Date(clerkUser.createdAt),
    },
  });
}
