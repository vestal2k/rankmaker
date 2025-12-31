import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const anonymousId = request.headers.get("x-anonymous-id");

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
        votes: {
          select: {
            userId: true,
            value: true,
          },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
    });

    if (!tierlist) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    const { userId: clerkId } = await auth();

    if (!tierlist.isPublic) {
      if (tierlist.anonymousId) {
        if (tierlist.anonymousId !== anonymousId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } else if (tierlist.userId) {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;
    const body = await request.json();
    const { title, description, coverImageUrl, isPublic, tiers, anonymousId } = body;

    const existingTierlist = await db.tierList.findUnique({
      where: { id },
    });

    if (!existingTierlist) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    if (existingTierlist.anonymousId) {
      if (existingTierlist.anonymousId !== anonymousId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (isPublic) {
        return NextResponse.json(
          { error: "Authentication required to publish public tier lists" },
          { status: 401 }
        );
      }
    } else if (existingTierlist.userId) {
      if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await db.user.findUnique({
        where: { clerkId },
      });

      if (!user || user.id !== existingTierlist.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await db.tier.deleteMany({
      where: { tierListId: id },
    });

    const updatedTierlist = await db.tierList.update({
      where: { id },
      data: {
        title: title || existingTierlist.title,
        description: description !== undefined ? description : existingTierlist.description,
        coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existingTierlist.coverImageUrl,
        isPublic: existingTierlist.anonymousId ? false : (isPublic !== undefined ? isPublic : existingTierlist.isPublic),
        tiers: tiers
          ? {
              create: tiers.map((tier: any, index: number) => ({
                name: tier.name,
                color: tier.color,
                order: index,
                items: {
                  create: (tier.items || []).map(
                    (item: any, itemIndex: number) => ({
                      mediaUrl: item.mediaUrl,
                      mediaType: item.mediaType || "IMAGE",
                      coverImageUrl: item.coverImageUrl || null,
                      embedId: item.embedId || null,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;
    const anonymousId = request.headers.get("x-anonymous-id");

    const tierlist = await db.tierList.findUnique({
      where: { id },
    });

    if (!tierlist) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    if (tierlist.anonymousId) {
      if (tierlist.anonymousId !== anonymousId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (tierlist.userId) {
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
