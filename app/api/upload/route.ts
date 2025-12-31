import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "GIF";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getMediaType(mimeType: string, fileName: string): MediaType {
  const mime = mimeType.toLowerCase();
  const name = fileName.toLowerCase();

  if (mime === "image/gif" || name.endsWith(".gif")) {
    return "GIF";
  }

  if (mime.startsWith("video/")) {
    return "VIDEO";
  }

  if (mime.startsWith("audio/")) {
    return "AUDIO";
  }

  return "IMAGE";
}

function getResourceType(mediaType: MediaType): "image" | "video" | "raw" {
  if (mediaType === "VIDEO") return "video";
  if (mediaType === "AUDIO") return "video";
  return "image";
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
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      const mediaType = getMediaType(file.type, file.name);
      const resourceType = getResourceType(mediaType);

      const result = await cloudinary.uploader.upload(dataUri, {
        resource_type: resourceType,
        folder: "rankmaker",
      });

      return {
        url: result.secure_url,
        originalName: file.name,
        mediaType,
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
