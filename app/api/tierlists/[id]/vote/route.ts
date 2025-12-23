import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/tierlists/[id]/vote - Vote on a tier list
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { value } = await request.json();

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: "Invalid vote value. Must be 1 (upvote) or -1 (downvote)" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if tierlist exists
    const tierList = await db.tierList.findUnique({
      where: { id },
    });

    if (!tierList) {
      return NextResponse.json({ error: "Tier list not found" }, { status: 404 });
    }

    // Check if already voted
    const existingVote = await db.vote.findUnique({
      where: {
        userId_tierListId: {
          userId: user.id,
          tierListId: id,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote, remove it (toggle off)
        await db.vote.delete({
          where: { id: existingVote.id },
        });
        return NextResponse.json({ message: "Vote removed", userVote: null });
      } else {
        // Different vote, update it
        await db.vote.update({
          where: { id: existingVote.id },
          data: { value },
        });
        return NextResponse.json({ message: "Vote updated", userVote: value });
      }
    }

    // Create new vote
    await db.vote.create({
      data: {
        value,
        userId: user.id,
        tierListId: id,
      },
    });

    return NextResponse.json({ message: "Vote recorded", userVote: value });
  } catch (error) {
    console.error("Error voting on tier list:", error);
    return NextResponse.json(
      { error: "Failed to vote on tier list" },
      { status: 500 }
    );
  }
}

// GET /api/tierlists/[id]/vote - Get vote status for current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    // Get vote score
    const votes = await db.vote.findMany({
      where: { tierListId: id },
      select: { value: true },
    });

    const score = votes.reduce((sum, vote) => sum + vote.value, 0);
    const upvotes = votes.filter((v) => v.value === 1).length;
    const downvotes = votes.filter((v) => v.value === -1).length;

    let userVote = null;

    if (clerkId) {
      const user = await db.user.findUnique({
        where: { clerkId },
      });

      if (user) {
        const vote = await db.vote.findUnique({
          where: {
            userId_tierListId: {
              userId: user.id,
              tierListId: id,
            },
          },
        });
        userVote = vote?.value ?? null;
      }
    }

    return NextResponse.json({
      score,
      upvotes,
      downvotes,
      userVote,
    });
  } catch (error) {
    console.error("Error getting vote status:", error);
    return NextResponse.json(
      { error: "Failed to get vote status" },
      { status: 500 }
    );
  }
}
