import { NextRequest, NextResponse } from "next/server";

import { googleMeetService } from "@/lib/services/google-meet-service";
import { requireAdminUser } from "@/lib/server/require-admin-user";

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdminUser(request);
    const authorizationUrl = await googleMeetService.getAuthorizationUrl(
      adminUser.uid
    );

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";

    if (message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error starting Google Meet OAuth flow:", error);

    return NextResponse.json(
      { error: "Failed to start Google Meet connection" },
      { status: 500 }
    );
  }
}
