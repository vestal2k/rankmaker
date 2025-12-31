import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const savedTierLists = await db.savedTierList.findMany({
      where: { userId: user.id },
      include: {
        tierList: {
          include: {
            user: {
              select: {
                username: true,
                imageUrl: true,
              },
            },
            votes: {
              select: { value: true },
            },
            _count: {
              select: { votes: true, comments: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const tierlistsWithScore = savedTierLists.map((saved) => ({
      ...saved.tierList,
      savedAt: saved.createdAt,
      voteScore: saved.tierList.votes.reduce((sum, vote) => sum + vote.value, 0),
      votes: undefined,
    }));

    return NextResponse.json(tierlistsWithScore);
  } catch (error) {
    console.error("Error fetching saved tier lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved tier lists" },
      { status: 500 }
    );
  }
}
