import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// POST /api/tierlists/[id]/use-template - Create a new tierlist from a template
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    // Get the original tierlist
    const original = await db.tierList.findUnique({
      where: { id },
      include: {
        tiers: {
          include: {
            items: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Tier list not found" },
        { status: 404 }
      );
    }

    if (!original.isPublic) {
      return NextResponse.json(
        { error: "Cannot use private tier list as template" },
        { status: 403 }
      );
    }

    // Create a new tierlist copy
    const newTierlist = await db.tierList.create({
      data: {
        title: original.title,
        description: original.description,
        coverImageUrl: original.coverImageUrl,
        isPublic: false, // Start as private
        userId: userId || null,
        anonymousId: userId ? null : `anon-${uuidv4()}`,
      },
    });

    // Collect all items from all tiers to put them in uncategorized
    const allItems: Array<{
      mediaUrl: string;
      mediaType: string;
      coverImageUrl: string | null;
      embedId: string | null;
      label: string | null;
    }> = [];

    for (const tier of original.tiers) {
      for (const item of tier.items) {
        allItems.push({
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          coverImageUrl: item.coverImageUrl,
          embedId: item.embedId,
          label: item.label,
        });
      }
    }

    // Create the same tiers structure (empty)
    for (const tier of original.tiers) {
      await db.tier.create({
        data: {
          name: tier.name,
          color: tier.color,
          order: tier.order,
          tierListId: newTierlist.id,
        },
      });
    }

    // Create an "Uncategorized" tier at the end with all items
    const uncategorizedTier = await db.tier.create({
      data: {
        name: "Uncategorized",
        color: "#808080",
        order: original.tiers.length,
        tierListId: newTierlist.id,
      },
    });

    // Add all items to uncategorized tier
    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      await db.tierItem.create({
        data: {
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType as any,
          coverImageUrl: item.coverImageUrl,
          embedId: item.embedId,
          label: item.label,
          order: i,
          tierId: uncategorizedTier.id,
        },
      });
    }

    return NextResponse.json({
      id: newTierlist.id,
      message: "Template copied successfully",
    });
  } catch (error) {
    console.error("Error using template:", error);
    return NextResponse.json(
      { error: "Failed to use template" },
      { status: 500 }
    );
  }
}
