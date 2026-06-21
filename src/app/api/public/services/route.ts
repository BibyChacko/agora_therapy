import { NextResponse } from "next/server";
import { AVAILABLE_SERVICES, SERVICE_CATEGORIES } from "@/types/models/service";
import { applyCacheHeaders } from "@/lib/server/http-cache";

/**
 * Public API to fetch available therapy services/specializations
 * No authentication required - this is public data
 */
export async function GET() {
  try {
    // Only return active services
    const activeServices = AVAILABLE_SERVICES.filter(service => service.isActive);

    const response = NextResponse.json({
      services: activeServices,
      categories: SERVICE_CATEGORIES,
      total: activeServices.length,
    });

    return applyCacheHeaders(response, {
      sMaxAge: 3600,
      staleWhileRevalidate: 86400,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
