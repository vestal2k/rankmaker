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
    const { id } = await params;
    const { value, anonymousId } = await request.json();

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: "Invalid vote value. Must be 1 (upvote) or -1 (downvote)" },
        { status: 400 }
      );
    }

    // Check if tierlist exists
    const tierList = await db.tierList.findUnique({
      where: { id },
    });

    if (!tierList) {
      return NextResponse.json({ error: "Tier list not found" }, { status: 404 });
    }

    // Handle authenticated user vote
    if (clerkId) {
      const user = await db.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
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

      // Create new vote for authenticated user
      await db.vote.create({
        data: {
          value,
          userId: user.id,
          tierListId: id,
        },
      });

      return NextResponse.json({ message: "Vote recorded", userVote: value });
    }

    // Handle anonymous user vote
    if (!anonymousId) {
      return NextResponse.json(
        { error: "Anonymous ID required for non-authenticated users" },
        { status: 400 }
      );
    }

    // Check if anonymous user already voted
    const existingAnonVote = await db.vote.findFirst({
      where: {
        anonymousId,
        tierListId: id,
      },
    });

    if (existingAnonVote) {
      if (existingAnonVote.value === value) {
        // Same vote, remove it (toggle off)
        await db.vote.delete({
          where: { id: existingAnonVote.id },
        });
        return NextResponse.json({ message: "Vote removed", userVote: null });
      } else {
        // Different vote, update it
        await db.vote.update({
          where: { id: existingAnonVote.id },
          data: { value },
        });
        return NextResponse.json({ message: "Vote updated", userVote: value });
      }
    }

    // Create new vote for anonymous user
    await db.vote.create({
      data: {
        value,
        anonymousId,
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
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("anonymousId");

    // Get vote score
    const votes = await db.vote.findMany({
      where: { tierListId: id },
      select: { value: true },
    });

    const score = votes.reduce((sum, vote) => sum + vote.value, 0);
    const upvotes = votes.filter((v) => v.value === 1).length;
    const downvotes = votes.filter((v) => v.value === -1).length;

    let userVote = null;

    // Check authenticated user vote
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
    } else if (anonymousId) {
      // Check anonymous user vote
      const vote = await db.vote.findFirst({
        where: {
          anonymousId,
          tierListId: id,
        },
      });
      userVote = vote?.value ?? null;
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
