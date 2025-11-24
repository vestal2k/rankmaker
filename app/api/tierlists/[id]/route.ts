import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tierlists/[id] - Get a specific tier list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tierlist = await db.tierList.findUnique({
      where: { id },
      include: {
        tiers: {
          include: {
            items: true,
          },
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!tierlist) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    // Check if tier list is public or belongs to the current user
    const { userId: clerkId } = await auth();

    if (!tierlist.isPublic) {
      if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await db.user.findUnique({
        where: { clerkId },
      });

      if (!user || user.id !== tierlist.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(tierlist);
  } catch (error) {
    console.error("Error fetching tier list:", error);
    return NextResponse.json(
      { error: "Failed to fetch tier list" },
      { status: 500 }
    );
  }
}

// PUT /api/tierlists/[id] - Update a tier list
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, isPublic, tiers } = body;

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if tier list belongs to user
    const existingTierlist = await db.tierList.findUnique({
      where: { id },
    });

    if (!existingTierlist) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    if (existingTierlist.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete old tiers and items, then create new ones
    await db.tier.deleteMany({
      where: { tierListId: id },
    });

    // Update tier list
    const updatedTierlist = await db.tierList.update({
      where: { id },
      data: {
        title: title || existingTierlist.title,
        description: description !== undefined ? description : existingTierlist.description,
        isPublic: isPublic !== undefined ? isPublic : existingTierlist.isPublic,
        tiers: tiers
          ? {
              create: tiers.map((tier: any, index: number) => ({
                name: tier.name,
                color: tier.color,
                order: index,
                items: {
                  create: (tier.items || []).map(
                    (item: any, itemIndex: number) => ({
                      imageUrl: item.imageUrl,
                      label: item.label || null,
                      order: itemIndex,
                    })
                  ),
                },
              })),
            }
          : undefined,
      },
      include: {
        tiers: {
          include: {
            items: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updatedTierlist);
  } catch (error) {
    console.error("Error updating tier list:", error);
    return NextResponse.json(
      { error: "Failed to update tier list" },
      { status: 500 }
    );
  }
}

// DELETE /api/tierlists/[id] - Delete a tier list
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

    // Check if tier list belongs to user
    const tierlist = await db.tierList.findUnique({
      where: { id },
    });

    if (!tierlist) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    if (tierlist.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete tier list (cascade will delete tiers and items)
    await db.tierList.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tier list deleted successfully" });
  } catch (error) {
    console.error("Error deleting tier list:", error);
    return NextResponse.json(
      { error: "Failed to delete tier list" },
      { status: 500 }
    );
  }
}
