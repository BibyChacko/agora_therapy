import { NextRequest, NextResponse } from "next/server";
import { getPublicTherapistById } from "@/lib/services/public-therapist-service";
import { createRateLimitResponse } from "@/lib/server/rate-limit";
import { applyCacheHeaders } from "@/lib/server/http-cache";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "public-therapist-detail",
      windowMs: 60 * 1000,
      maxRequests: 90,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const { id } = await context.params;
    const therapist = await getPublicTherapistById(id);

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(therapist);

    applyCacheHeaders(response, {
      sMaxAge: 300,
      staleWhileRevalidate: 600,
    });

    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist" },
      { status: 500 }
    );
  }
}
