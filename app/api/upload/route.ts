import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "GIF";

function getMediaType(file: File): MediaType {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // Check for GIF specifically (before general image check)
  if (mimeType === "image/gif" || fileName.endsWith(".gif")) {
    return "GIF";
  }

  // Check for video types
  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  // Check for audio types
  if (mimeType.startsWith("audio/")) {
    return "AUDIO";
  }

  // Default to image for all other image types
  return "IMAGE";
}

// POST /api/upload - Upload media files to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Upload all files to Vercel Blob
    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true, // Prevents name collisions
      });

      return {
        url: blob.url,
        originalName: file.name,
        mediaType: getMediaType(file),
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json({ files: uploadedFiles }, { status: 200 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
