import { validateRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await validateRequest();
    const { id } = await params;

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const tierList = await db.tierList.findUnique({
      where: { id },
    });

    if (!tierList) {
      return NextResponse.json({ error: "Tier list not found" }, { status: 404 });
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

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
