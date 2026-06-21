import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createRateLimitResponse } from "@/lib/server/rate-limit";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "upload-post",
      windowMs: 10 * 60 * 1000,
      maxRequests: 20,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: folder, 
          resource_type: "auto",
          access_mode: "public"
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const response = NextResponse.json({
      message: "Uploaded successfully",
      url: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id
    }, { status: 200 });

    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ message: "Failed to upload to Cloudinary" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "upload-delete",
      windowMs: 10 * 60 * 1000,
      maxRequests: 30,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json({ message: "No publicId provided" }, { status: 400 });
    }

    const deleteResult = await cloudinary.uploader.destroy(publicId);

    const response = NextResponse.json({
      message: "Deleted successfully",
      result: deleteResult
    }, { status: 200 });

    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json({ message: "Failed to delete from Cloudinary" }, { status: 500 });
  }
}
