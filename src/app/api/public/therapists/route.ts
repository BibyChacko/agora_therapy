import { NextRequest, NextResponse } from "next/server";
import { getPublicTherapists } from "@/lib/services/public-therapist-service";

export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json({
      therapists,
      total: therapists.length,
    });
  } catch (error) {
    console.error("Error fetching public therapists:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapists" },
      { status: 500 }
    );
  }
}
