import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "GIF";

function getMediaType(file: File): MediaType {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (mimeType === "image/gif" || fileName.endsWith(".gif")) {
    return "GIF";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  if (mimeType.startsWith("audio/")) {
    return "AUDIO";
  }

  return "IMAGE";
}

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

    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
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
