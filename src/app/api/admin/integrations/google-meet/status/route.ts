import { NextRequest, NextResponse } from "next/server";

import { googleMeetService } from "@/lib/services/google-meet-service";
import { requireAdminUser } from "@/lib/server/require-admin-user";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser(request);
    const status = await googleMeetService.getConnectionStatus();
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";

    if (message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error fetching Google Meet status:", error);

    return NextResponse.json(
      { error: "Failed to fetch Google Meet status" },
      { status: 500 }
    );
  }
}
