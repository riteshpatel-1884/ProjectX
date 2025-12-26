"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { success: false, error: "Name and email are required" };
  }

  try {
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        name: name.trim(),
        email: email.trim(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update profile" };
  }
}