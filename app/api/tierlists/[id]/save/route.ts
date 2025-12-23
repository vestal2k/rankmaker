import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tierlists/[id]/save - Check if current user has saved this tier list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) {
      return NextResponse.json({ isSaved: false });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ isSaved: false });
    }

    const savedTierList = await db.savedTierList.findUnique({
      where: {
        userId_tierListId: {
          userId: user.id,
          tierListId: id,
        },
      },
    });

    return NextResponse.json({ isSaved: !!savedTierList });
  } catch (error) {
    console.error("Error checking save status:", error);
    return NextResponse.json({ isSaved: false });
  }
}

// POST /api/tierlists/[id]/save - Save a tier list
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

    // Check if already saved
    const existingSave = await db.savedTierList.findUnique({
      where: {
        userId_tierListId: {
          userId: user.id,
          tierListId: id,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json(
        { error: "Already saved" },
        { status: 400 }
      );
    }

    // Create save
    await db.savedTierList.create({
      data: {
        userId: user.id,
        tierListId: id,
      },
    });

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Error saving tier list:", error);
    return NextResponse.json(
      { error: "Failed to save tier list" },
      { status: 500 }
    );
  }
}

// DELETE /api/tierlists/[id]/save - Unsave a tier list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete save
    await db.savedTierList.delete({
      where: {
        userId_tierListId: {
          userId: user.id,
          tierListId: id,
        },
      },
    });

    return NextResponse.json({ message: "Unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving tier list:", error);
    return NextResponse.json(
      { error: "Failed to unsave tier list" },
      { status: 500 }
    );
  }
}
