import { NextRequest, NextResponse } from "next/server";

import { getAdminFirestore } from "@/lib/firebase/admin";
import {
  getPublicTherapistById,
  getPublicTherapistBySlug,
} from "@/lib/services/public-therapist-service";
import { applyCacheHeaders } from "@/lib/server/http-cache";
import { createRateLimitResponse } from "@/lib/server/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "public-therapist-availability",
      windowMs: 60 * 1000,
      maxRequests: 90,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const { id } = await context.params;
    const therapist =
      (await getPublicTherapistBySlug(id)) || (await getPublicTherapistById(id));

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    const db = getAdminFirestore();
    const now = new Date();
    const overridesSnapshot = await db
      .collection("scheduleOverrides")
      .where("therapistId", "==", therapist.id)
      .get();

    const overrideDates = Array.from(
      new Set(
        overridesSnapshot.docs
          .map((doc) => doc.data())
          .map((override) => override.date?.toDate?.())
          .filter((date): date is Date => Boolean(date) && date >= now)
          .map((date) => date.toISOString().split("T")[0])
      )
    ).sort();

    const response = NextResponse.json({
      therapistId: therapist.id,
      timezone: therapist.timezone || "UTC",
      overrideDates,
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
    console.error("Error fetching public therapist availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist availability" },
      { status: 500 }
    );
  }
}
