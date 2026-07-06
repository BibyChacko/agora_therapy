import { endOfDay, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { AvailableSlotsService } from "@/lib/services/available-slots-service";
import { applyCacheHeaders } from "@/lib/server/http-cache";
import { createRateLimitResponse } from "@/lib/server/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "public-therapist-slots",
      windowMs: 60 * 1000,
      maxRequests: 90,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);

    const dateParam = searchParams.get("date");
    const clientTimezone = searchParams.get("timezone") || undefined;
    const duration = Number(searchParams.get("duration") || "50");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Missing required date query parameter" },
        { status: 400 }
      );
    }

    const targetDate = new Date(dateParam);
    if (Number.isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const result = await AvailableSlotsService.calculateAvailableSlots(id, {
      startDate: startOfDay(targetDate),
      endDate: endOfDay(targetDate),
      clientTimezone,
      duration,
    });

    const slots = result.availableSlots
      .filter((slot) => !slot.isBooked)
      .map((slot) => ({
        timeSlotId: slot.timeSlotId,
        localDate: slot.localDate,
        localStartTime: slot.localStartTime,
        localEndTime: slot.localEndTime,
        displayTime: slot.displayTime,
        duration: slot.duration,
        currency: slot.currency,
        price: slot.price,
        therapistTimezone: slot.therapistTimezone,
        isOverride: Boolean(slot.isOverride),
      }));

    const response = NextResponse.json({
      therapistId: id,
      timezone: result.timezone,
      date: targetDate.toISOString(),
      slots,
    });

    applyCacheHeaders(response, {
      sMaxAge: 60,
      staleWhileRevalidate: 120,
    });

    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error fetching public therapist slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist slots" },
      { status: 500 }
    );
  }
}
