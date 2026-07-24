import { endOfDay, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { businessConfig } from "@/lib/config";
import { AvailableSlotsService } from "@/lib/services/available-slots-service";
import { PricingService } from "@/lib/services/pricing-service";
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

    const therapist =
      (await getPublicTherapistBySlug(id)) || (await getPublicTherapistById(id));

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    const result = await AvailableSlotsService.calculateAvailableSlots(therapist.id, {
      startDate: startOfDay(targetDate),
      endDate: endOfDay(targetDate),
      clientTimezone,
      duration,
    });

    const slots = result.availableSlots
      .filter((slot) => !slot.isBooked)
      .map(async (slot) => {
        const pricePresentation = await PricingService.buildPricePresentation({
          usdAmountMinor: slot.price,
          request,
          fallbackCurrency: slot.currency,
          baseCurrency: slot.currency,
        });

        return {
          timeSlotId: slot.timeSlotId,
          localDate: slot.localDate,
          localStartTime: slot.localStartTime,
          localEndTime: slot.localEndTime,
          displayTime: slot.displayTime,
          duration: slot.duration,
          currency: pricePresentation.displayCurrency,
          price: pricePresentation.displayAmountMinor,
          therapistTimezone: slot.therapistTimezone,
          isOverride: Boolean(slot.isOverride),
          pricing: {
            countryCode: pricePresentation.countryCode,
            displayCurrency: pricePresentation.displayCurrency,
            displayAmount: pricePresentation.displayAmountMinor,
            baseCurrency: pricePresentation.baseCurrency,
            baseAmount: pricePresentation.baseAmountMinor,
            exchangeRate: pricePresentation.exchangeRate,
            rateDate: pricePresentation.rateDate,
            source: pricePresentation.source,
          },
        };
      });

    const resolvedSlots = await Promise.all(slots);

    const firstBookableAt = new Date(
      Date.now() + businessConfig.minAdvanceBookingHours * 60 * 60 * 1000
    );
    const firstBookableDate = startOfDay(firstBookableAt);
    const isBeforeBookingWindow = targetDate < firstBookableDate;

    const response = NextResponse.json({
      therapistId: therapist.id,
      timezone: result.timezone,
      date: targetDate.toISOString(),
      slots: resolvedSlots,
      bookingWindow: {
        minAdvanceHours: businessConfig.minAdvanceBookingHours,
        earliestBookableAt: firstBookableAt.toISOString(),
      },
      ...(resolvedSlots.length === 0 && isBeforeBookingWindow && businessConfig.minAdvanceBookingHours > 0
        ? {
            message: `Bookings must be scheduled at least ${businessConfig.minAdvanceBookingHours} hours in advance.`,
          }
        : {}),
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
