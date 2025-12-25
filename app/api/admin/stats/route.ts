// app/api/admin/stats/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users for statistics
    const allUsers = await prisma.user.findMany();

    // Calculate statistics
    const totalUsers = allUsers.length;
    const adminUsers = allUsers.filter((u) => u.role === "admin").length;
    const subscribedUsers = allUsers.filter((u) => u.isSubscribed).length;
    const totalCreditsAllocated = allUsers.reduce(
      (sum, u) => sum + u.totalCredit,
      0
    );
    const averageCreditsUsed =
      totalUsers > 0
        ? allUsers.reduce((sum, u) => sum + u.userCredit, 0) / totalUsers
        : 0;

    // Calculate recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSignups = allUsers.filter(
      (u) => new Date(u.joinedAt) >= sevenDaysAgo
    ).length;

    return NextResponse.json({
      totalUsers,
      adminUsers,
      subscribedUsers,
      totalCreditsAllocated,
      averageCreditsUsed,
      recentSignups,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}