import { NextResponse } from "next/server";
import { LANGUAGES, POPULAR_INDIAN_LANGUAGES, LANGUAGE_GROUPS } from "@/lib/constants/languages";
import { applyCacheHeaders } from "@/lib/server/http-cache";

/**
 * Public API to fetch available languages
 * No authentication required - this is public data
 */
export async function GET() {
  try {
    const response = NextResponse.json({
      languages: LANGUAGES,
      popularIndianLanguages: POPULAR_INDIAN_LANGUAGES,
      languageGroups: LANGUAGE_GROUPS,
    });

    return applyCacheHeaders(response, {
      sMaxAge: 3600,
      staleWhileRevalidate: 86400,
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
