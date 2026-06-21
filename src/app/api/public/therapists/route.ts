import { NextRequest, NextResponse } from "next/server";
import { getPublicTherapists } from "@/lib/services/public-therapist-service";
import { createRateLimitResponse } from "@/lib/server/rate-limit";
import { applyCacheHeaders } from "@/lib/server/http-cache";

export async function GET(request: NextRequest) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "public-therapists-list",
      windowMs: 60 * 1000,
      maxRequests: 60,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization') || undefined;
    const language = searchParams.get('language') || undefined;
    const minExperience = searchParams.get('minExperience') || undefined;
    const featured = searchParams.get('featured') === 'true';

    const therapists = await getPublicTherapists({
      specialization,
      language,
      minExperience,
      featured
    });

    const response = NextResponse.json({
      therapists,
      total: therapists.length,
    });

    applyCacheHeaders(response, {
      sMaxAge: 300,
      staleWhileRevalidate: 600,
    });

    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error fetching public therapists:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapists" },
      { status: 500 }
    );
  }
}
