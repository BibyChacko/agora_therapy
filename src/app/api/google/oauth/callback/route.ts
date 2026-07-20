import { NextRequest, NextResponse } from "next/server";

import { googleMeetService } from "@/lib/services/google-meet-service";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/admin/settings?googleMeet=error&reason=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/admin/settings?googleMeet=error&reason=missing_callback_params`
    );
  }

  try {
    await googleMeetService.completeAuthorization(code, state);

    return NextResponse.redirect(
      `${request.nextUrl.origin}/admin/settings?googleMeet=connected`
    );
  } catch (callbackError) {
    console.error("Error completing Google Meet OAuth flow:", callbackError);

    const reason =
      callbackError instanceof Error
        ? callbackError.message
        : "google_meet_connection_failed";

    return NextResponse.redirect(
      `${request.nextUrl.origin}/admin/settings?googleMeet=error&reason=${encodeURIComponent(reason)}`
    );
  }
}
