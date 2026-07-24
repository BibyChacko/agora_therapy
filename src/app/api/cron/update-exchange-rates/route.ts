import { NextRequest, NextResponse } from "next/server";

import { PricingService } from "@/lib/services/pricing-service";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rates = await PricingService.refreshUsdExchangeRates();

    return NextResponse.json({
      success: true,
      baseCurrency: rates.baseCurrency,
      date: rates.date,
      currencies: Object.keys(rates.rates).length,
      provider: rates.provider,
    });
  } catch (error) {
    console.error("Error updating exchange rates:", error);
    return NextResponse.json(
      { error: "Failed to update exchange rates" },
      { status: 500 }
    );
  }
}

