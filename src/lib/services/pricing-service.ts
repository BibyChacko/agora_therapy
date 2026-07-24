import { FieldValue } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

import { getAdminFirestore } from "@/lib/firebase/admin";

const EXCHANGE_RATES_COLLECTION = "exchangeRates";
const USD = "USD";
const DEFAULT_PLATFORM_FEE_USD_MINOR = 1500;
const COMMISSION_REFERENCE_RATE_USD_TO_AED = 3.6725;
const COMMISSION_INVERSE_ALPHA = 0.5;
const DEFAULT_SITE_COUNTRY_CODE = "AE";
const DISPLAY_ROUNDING_INCREMENT_MAJOR = 5;

const FALLBACK_USD_RATES: Record<string, number> = {
  AED: 3.6725,
  INR: 95.33,
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  AE: "AED",
  AU: "AUD",
  BH: "BHD",
  CA: "CAD",
  CH: "CHF",
  DE: "EUR",
  EG: "EGP",
  ES: "EUR",
  FR: "EUR",
  GB: "GBP",
  IN: "INR",
  IT: "EUR",
  JO: "JOD",
  JP: "JPY",
  KW: "KWD",
  LK: "LKR",
  MA: "MAD",
  MY: "MYR",
  NG: "NGN",
  NL: "EUR",
  NZ: "NZD",
  OM: "OMR",
  PH: "PHP",
  PK: "PKR",
  QA: "QAR",
  SA: "SAR",
  SE: "SEK",
  SG: "SGD",
  TH: "THB",
  TR: "TRY",
  US: "USD",
  ZA: "ZAR",
};

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

const THREE_DECIMAL_CURRENCIES = new Set([
  "BHD",
  "IQD",
  "JOD",
  "KWD",
  "LYD",
  "OMR",
  "TND",
]);

interface ExchangeRatesDocument {
  baseCurrency: string;
  date: string;
  provider: string;
  rates: Record<string, number>;
  fetchedAt?: unknown;
  updatedAt?: unknown;
}

interface FrankfurterRateRow {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

interface StoredCountryPricingRule {
  therapistFeeMultiplier?: number;
  therapistFeeMarkupPercent?: number;
  platformFeeUsdMinor?: number;
  preferredCurrency?: string;
}

interface TherapistPricingConfig {
  countryCode?: string;
  foreignClientSurchargePercent?: number;
  countryPricingRules?: Record<string, StoredCountryPricingRule>;
}

export interface PricingContext {
  countryCode: string | null;
  currency: string;
  source: "geo" | "profile" | "fallback";
}

export interface LocalizedMoney {
  amountMinor: number;
  currency: string;
  exponent: number;
}

export interface PricePresentation {
  countryCode: string | null;
  displayCurrency: string;
  displayAmountMinor: number;
  displayCurrencyExponent: number;
  baseCurrency: string;
  baseAmountMinor: number;
  exchangeRate: number | null;
  rateDate: string | null;
  source: PricingContext["source"];
}

export interface TherapistPriceSummary {
  countryCode: string | null;
  displayCurrency: string;
  displayHourlyRate: number;
  displayPlatformFee: number;
  displayHourlyTotal: number;
  displayCurrencyExponent: number;
  baseCurrency: string;
  baseHourlyRate: number;
  basePlatformFeeUsd: number;
  exchangeRate: number | null;
  rateDate: string | null;
  source: PricingContext["source"];
}

export interface BookingPricingResult {
  context: PricingContext;
  therapistFee: LocalizedMoney;
  platformFee: LocalizedMoney;
  total: LocalizedMoney;
  usdReference: {
    therapistFeeMinor: number;
    platformFeeMinor: number;
    totalMinor: number;
  };
  exchangeRate: number | null;
  rateDate: string | null;
  appliedRule: {
    type: "default" | "foreign_surcharge" | "country_override";
    description: string;
  };
  baseCurrency: string;
}

function normalizeCurrencyCode(currency?: string | null) {
  return String(currency || USD).toUpperCase();
}

function normalizeCountryCode(countryCode?: string | null) {
  const normalized = String(countryCode || "").trim().toUpperCase();
  return normalized || null;
}

function parseCookieValue(cookieHeader?: string | null, key?: string) {
  if (!cookieHeader || !key) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [cookieKey, ...cookieValueParts] = cookie.split("=");
    if (cookieKey === key) {
      return cookieValueParts.join("=") || null;
    }
  }

  return null;
}

function getCurrencyExponent(currency: string) {
  const normalized = normalizeCurrencyCode(currency);

  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) {
    return 0;
  }

  if (THREE_DECIMAL_CURRENCIES.has(normalized)) {
    return 3;
  }

  return 2;
}

function majorToMinor(amountMajor: number, currency: string) {
  const exponent = getCurrencyExponent(currency);
  return Math.round(amountMajor * 10 ** exponent);
}

function roundMinorToNearestIncrement(
  amountMinor: number,
  currency: string,
  incrementMajor = DISPLAY_ROUNDING_INCREMENT_MAJOR
) {
  const amountMajor = minorToMajor(amountMinor, currency);
  const roundedMajor =
    Math.round(amountMajor / incrementMajor) * incrementMajor;
  return majorToMinor(roundedMajor, currency);
}

function calculateInverseCommissionMajor(params: {
  baseCommissionUsd: number;
  targetRate: number;
}) {
  return (
    params.baseCommissionUsd *
    COMMISSION_REFERENCE_RATE_USD_TO_AED *
    Math.pow(
      params.targetRate / COMMISSION_REFERENCE_RATE_USD_TO_AED,
      COMMISSION_INVERSE_ALPHA
    )
  );
}

function minorToMajor(amountMinor: number, currency: string) {
  const exponent = getCurrencyExponent(currency);
  return amountMinor / 10 ** exponent;
}

function resolveCurrencyFromCountry(countryCode?: string | null) {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  if (!normalizedCountryCode) {
    return USD;
  }

  return COUNTRY_TO_CURRENCY[normalizedCountryCode] || USD;
}

function parseTherapistPricingConfig(rawPractice: unknown): TherapistPricingConfig {
  if (!rawPractice || typeof rawPractice !== "object") {
    return {};
  }

  const practice = rawPractice as Record<string, unknown>;
  const pricing = (practice.pricing || {}) as Record<string, unknown>;
  const countryPricingRules =
    pricing.countryPricingRules && typeof pricing.countryPricingRules === "object"
      ? (pricing.countryPricingRules as Record<string, StoredCountryPricingRule>)
      : undefined;

  return {
    countryCode: normalizeCountryCode(
      typeof practice.countryCode === "string"
        ? practice.countryCode
        : typeof pricing.countryCode === "string"
          ? pricing.countryCode
          : null
    ) || undefined,
    foreignClientSurchargePercent:
      typeof pricing.foreignClientSurchargePercent === "number"
        ? pricing.foreignClientSurchargePercent
        : undefined,
    countryPricingRules,
  };
}

function normalizeFrankfurterRates(payload: unknown) {
  if (Array.isArray(payload)) {
    const rows = payload as FrankfurterRateRow[];
    const firstRow = rows[0];
    const baseCurrency = normalizeCurrencyCode(firstRow?.base || USD);
    const date = firstRow?.date || new Date().toISOString().slice(0, 10);
    const rates: Record<string, number> = {
      [baseCurrency]: 1,
    };

    for (const row of rows) {
      if (
        row &&
        typeof row.quote === "string" &&
        typeof row.rate === "number"
      ) {
        rates[normalizeCurrencyCode(row.quote)] = row.rate;
      }
    }

    return {
      baseCurrency,
      date,
      rates,
    };
  }

  const objectPayload = payload as {
    base?: string;
    date?: string;
    rates?: Record<string, number>;
  };

  const baseCurrency = normalizeCurrencyCode(objectPayload.base || USD);

  return {
    baseCurrency,
    date: objectPayload.date || new Date().toISOString().slice(0, 10),
    rates: {
      [baseCurrency]: 1,
      ...(objectPayload.rates || {}),
    },
  };
}

export class PricingService {
  static resolvePricingContextFromCountryCode(
    countryCode?: string | null,
    options?: {
      fallbackCurrency?: string | null;
    }
  ): PricingContext {
    const normalizedCountryCode = normalizeCountryCode(countryCode);

    if (normalizedCountryCode) {
      return {
        countryCode: normalizedCountryCode,
        currency: resolveCurrencyFromCountry(normalizedCountryCode),
        source: "geo",
      };
    }

    return {
      countryCode: null,
      currency: normalizeCurrencyCode(options?.fallbackCurrency),
      source: "fallback",
    };
  }

  static resolvePricingContextFromRequest(
    request: NextRequest,
    options?: {
      profileCountryCode?: string | null;
      fallbackCurrency?: string | null;
    }
  ): PricingContext {
    const headerCountry = this.resolveCountryCodeFromHeaders(
      request.headers,
      options?.profileCountryCode
    );

    if (headerCountry) {
      return {
        countryCode: headerCountry,
        currency: resolveCurrencyFromCountry(headerCountry),
        source: "geo",
      };
    }

    const profileCountry = normalizeCountryCode(options?.profileCountryCode);
    if (profileCountry) {
      return {
        countryCode: profileCountry,
        currency: resolveCurrencyFromCountry(profileCountry),
        source: "profile",
      };
    }

    return {
      countryCode: null,
      currency: normalizeCurrencyCode(options?.fallbackCurrency),
      source: "fallback",
    };
  }

  static resolveCountryCodeFromHeaders(
    headers: Pick<Headers, "get">,
    profileCountryCode?: string | null
  ) {
    return (
      normalizeCountryCode(headers.get("x-vercel-ip-country")) ||
      normalizeCountryCode(headers.get("cf-ipcountry")) ||
      normalizeCountryCode(headers.get("x-country-code")) ||
      normalizeCountryCode(headers.get("cloudfront-viewer-country")) ||
      normalizeCountryCode(
        parseCookieValue(headers.get("cookie"), "mindgood_country")
      ) ||
      normalizeCountryCode(profileCountryCode) ||
      DEFAULT_SITE_COUNTRY_CODE
    );
  }

  static getUsdRate(currency: string, ratesDoc?: ExchangeRatesDocument | null) {
    const normalizedCurrency = normalizeCurrencyCode(currency);

    if (normalizedCurrency === USD) {
      return 1;
    }

    return (
      ratesDoc?.rates?.[normalizedCurrency] ||
      FALLBACK_USD_RATES[normalizedCurrency] ||
      null
    );
  }

  static async getUsdExchangeRates() {
    const snapshot = await getAdminFirestore()
      .collection(EXCHANGE_RATES_COLLECTION)
      .doc(USD)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data() as ExchangeRatesDocument;
  }

  static async refreshUsdExchangeRates(quotes?: string[]) {
    const url = new URL("https://api.frankfurter.dev/v2/rates");
    url.searchParams.set("base", USD);

    if (quotes?.length) {
      url.searchParams.set(
        "quotes",
        quotes.map((quote) => normalizeCurrencyCode(quote)).join(",")
      );
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Frankfurter request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const normalized = normalizeFrankfurterRates(payload);

    const document: ExchangeRatesDocument = {
      baseCurrency: normalized.baseCurrency,
      date: normalized.date,
      provider: "frankfurter",
      rates: normalized.rates,
      fetchedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await getAdminFirestore()
      .collection(EXCHANGE_RATES_COLLECTION)
      .doc(USD)
      .set(document, { merge: true });

    return document;
  }

  static async buildPricePresentation(params: {
    usdAmountMinor: number;
    request: NextRequest;
    fallbackCurrency?: string;
    profileCountryCode?: string | null;
    baseCurrency?: string;
  }): Promise<PricePresentation> {
    const baseCurrency = normalizeCurrencyCode(params.baseCurrency || USD);
    const context = this.resolvePricingContextFromRequest(params.request, {
      profileCountryCode: params.profileCountryCode,
      fallbackCurrency: params.fallbackCurrency || baseCurrency,
    });

    if (baseCurrency !== USD) {
      return {
        countryCode: context.countryCode,
        displayCurrency: baseCurrency,
        displayAmountMinor: params.usdAmountMinor,
        displayCurrencyExponent: getCurrencyExponent(baseCurrency),
        baseCurrency,
        baseAmountMinor: params.usdAmountMinor,
        exchangeRate: baseCurrency === context.currency ? 1 : null,
        rateDate: null,
        source: context.source,
      };
    }

    if (context.currency === USD) {
      return {
        countryCode: context.countryCode,
        displayCurrency: USD,
        displayAmountMinor: params.usdAmountMinor,
        displayCurrencyExponent: getCurrencyExponent(USD),
        baseCurrency: USD,
        baseAmountMinor: params.usdAmountMinor,
        exchangeRate: 1,
        rateDate: null,
        source: context.source,
      };
    }

    const ratesDoc = await this.getUsdExchangeRates();
    const exchangeRate = this.getUsdRate(context.currency, ratesDoc);

    if (!exchangeRate) {
      return {
        countryCode: context.countryCode,
        displayCurrency: USD,
        displayAmountMinor: params.usdAmountMinor,
        displayCurrencyExponent: getCurrencyExponent(USD),
        baseCurrency: USD,
        baseAmountMinor: params.usdAmountMinor,
        exchangeRate: null,
        rateDate: ratesDoc?.date || null,
        source: "fallback",
      };
    }

    const localizedAmountMinor = roundMinorToNearestIncrement(
      majorToMinor(
        minorToMajor(params.usdAmountMinor, USD) * exchangeRate,
        context.currency
      ),
      context.currency
    );

    return {
      countryCode: context.countryCode,
      displayCurrency: context.currency,
      displayAmountMinor: localizedAmountMinor,
      displayCurrencyExponent: getCurrencyExponent(context.currency),
      baseCurrency: USD,
      baseAmountMinor: params.usdAmountMinor,
      exchangeRate,
      rateDate: ratesDoc?.date || null,
      source: context.source,
    };
  }

  static async calculateBookingPricing(params: {
    request: NextRequest;
    therapistProfile: {
      practice?: {
        hourlyRate?: number;
        currency?: string;
      };
      availability?: {
        timezone?: string;
      };
    };
    profileCountryCode?: string | null;
    sessionDurationMinutes: number;
    defaultPlatformFeeUsdMinor?: number;
  }): Promise<BookingPricingResult> {
    const pricingConfig = parseTherapistPricingConfig(params.therapistProfile.practice);
    const baseCurrency = normalizeCurrencyCode(
      params.therapistProfile.practice?.currency || USD
    );
    const baseHourlyRateMinor = Number(params.therapistProfile.practice?.hourlyRate || 0);
    const normalizedHourlyRateMinor =
      baseHourlyRateMinor > 0 && baseHourlyRateMinor < 1000
        ? baseHourlyRateMinor * 100
        : baseHourlyRateMinor;

    const therapistCountryCode = pricingConfig.countryCode || "AE";
    const context = this.resolvePricingContextFromRequest(params.request, {
      profileCountryCode: params.profileCountryCode,
      fallbackCurrency: baseCurrency,
    });

    let therapistFeeUsdMinor = Math.round(
      (normalizedHourlyRateMinor * params.sessionDurationMinutes) / 60
    );
    let platformFeeUsdMinor =
      params.defaultPlatformFeeUsdMinor ?? DEFAULT_PLATFORM_FEE_USD_MINOR;
    let appliedRule: BookingPricingResult["appliedRule"] = {
      type: "default",
      description: "Default USD pricing",
    };

    const countryRule =
      context.countryCode && pricingConfig.countryPricingRules
        ? pricingConfig.countryPricingRules[context.countryCode]
        : undefined;

    if (countryRule) {
      if (typeof countryRule.therapistFeeMultiplier === "number") {
        therapistFeeUsdMinor = Math.round(
          therapistFeeUsdMinor * countryRule.therapistFeeMultiplier
        );
      }

      if (typeof countryRule.therapistFeeMarkupPercent === "number") {
        therapistFeeUsdMinor = Math.round(
          therapistFeeUsdMinor * (1 + countryRule.therapistFeeMarkupPercent / 100)
        );
      }

      if (typeof countryRule.platformFeeUsdMinor === "number") {
        platformFeeUsdMinor = Math.round(countryRule.platformFeeUsdMinor);
      }

      appliedRule = {
        type: "country_override",
        description: `Applied country-specific pricing for ${context.countryCode}`,
      };
    } else if (
      context.countryCode &&
      context.countryCode !== therapistCountryCode &&
      typeof pricingConfig.foreignClientSurchargePercent === "number"
    ) {
      therapistFeeUsdMinor = Math.round(
        therapistFeeUsdMinor *
          (1 + pricingConfig.foreignClientSurchargePercent / 100)
      );
      appliedRule = {
        type: "foreign_surcharge",
        description: `Applied foreign-client surcharge for ${context.countryCode}`,
      };
    }

    const totalUsdMinor = therapistFeeUsdMinor + platformFeeUsdMinor;

    if (baseCurrency !== USD) {
      return {
        context: {
          ...context,
          currency: baseCurrency,
        },
        therapistFee: {
          amountMinor: therapistFeeUsdMinor,
          currency: baseCurrency,
          exponent: getCurrencyExponent(baseCurrency),
        },
        platformFee: {
          amountMinor: platformFeeUsdMinor,
          currency: baseCurrency,
          exponent: getCurrencyExponent(baseCurrency),
        },
        total: {
          amountMinor: totalUsdMinor,
          currency: baseCurrency,
          exponent: getCurrencyExponent(baseCurrency),
        },
        usdReference: {
          therapistFeeMinor: therapistFeeUsdMinor,
          platformFeeMinor: platformFeeUsdMinor,
          totalMinor: totalUsdMinor,
        },
        exchangeRate: baseCurrency === USD ? 1 : null,
        rateDate: null,
        appliedRule,
        baseCurrency,
      };
    }

    const targetCurrency = countryRule?.preferredCurrency
      ? normalizeCurrencyCode(countryRule.preferredCurrency)
      : context.currency;

    if (targetCurrency === USD) {
      return {
        context: {
          ...context,
          currency: USD,
        },
        therapistFee: {
          amountMinor: therapistFeeUsdMinor,
          currency: USD,
          exponent: getCurrencyExponent(USD),
        },
        platformFee: {
          amountMinor: platformFeeUsdMinor,
          currency: USD,
          exponent: getCurrencyExponent(USD),
        },
        total: {
          amountMinor: totalUsdMinor,
          currency: USD,
          exponent: getCurrencyExponent(USD),
        },
        usdReference: {
          therapistFeeMinor: therapistFeeUsdMinor,
          platformFeeMinor: platformFeeUsdMinor,
          totalMinor: totalUsdMinor,
        },
        exchangeRate: 1,
        rateDate: null,
        appliedRule,
        baseCurrency,
      };
    }

    const ratesDoc = await this.getUsdExchangeRates();
    const exchangeRate = this.getUsdRate(targetCurrency, ratesDoc);

    if (!exchangeRate) {
      return {
        context: {
          ...context,
          currency: USD,
          source: "fallback",
        },
        therapistFee: {
          amountMinor: therapistFeeUsdMinor,
          currency: USD,
          exponent: getCurrencyExponent(USD),
        },
        platformFee: {
          amountMinor: platformFeeUsdMinor,
          currency: USD,
          exponent: getCurrencyExponent(USD),
        },
        total: {
          amountMinor: totalUsdMinor,
          currency: USD,
          exponent: getCurrencyExponent(USD),
        },
        usdReference: {
          therapistFeeMinor: therapistFeeUsdMinor,
          platformFeeMinor: platformFeeUsdMinor,
          totalMinor: totalUsdMinor,
        },
        exchangeRate: null,
        rateDate: ratesDoc?.date || null,
        appliedRule,
        baseCurrency,
      };
    }

    const convertUsdMinorToTarget = (usdMinor: number) =>
      majorToMinor(minorToMajor(usdMinor, USD) * exchangeRate, targetCurrency);

    const localizedTherapistFee = roundMinorToNearestIncrement(
      convertUsdMinorToTarget(therapistFeeUsdMinor),
      targetCurrency
    );
    const localizedPlatformFee = roundMinorToNearestIncrement(
      majorToMinor(
        calculateInverseCommissionMajor({
          baseCommissionUsd: minorToMajor(platformFeeUsdMinor, USD),
          targetRate: exchangeRate,
        }),
        targetCurrency
      ),
      targetCurrency
    );

    return {
      context: {
        ...context,
        currency: targetCurrency,
      },
      therapistFee: {
        amountMinor: localizedTherapistFee,
        currency: targetCurrency,
        exponent: getCurrencyExponent(targetCurrency),
      },
      platformFee: {
        amountMinor: localizedPlatformFee,
        currency: targetCurrency,
        exponent: getCurrencyExponent(targetCurrency),
      },
      total: {
        amountMinor: localizedTherapistFee + localizedPlatformFee,
        currency: targetCurrency,
        exponent: getCurrencyExponent(targetCurrency),
      },
      usdReference: {
        therapistFeeMinor: therapistFeeUsdMinor,
        platformFeeMinor: platformFeeUsdMinor,
        totalMinor: totalUsdMinor,
      },
      exchangeRate,
      rateDate: ratesDoc?.date || null,
      appliedRule,
      baseCurrency,
    };
  }

  static async buildPricePresentationForCountry(params: {
    usdAmountMinor: number;
    countryCode?: string | null;
    fallbackCurrency?: string;
    baseCurrency?: string;
  }): Promise<PricePresentation> {
    const baseCurrency = normalizeCurrencyCode(params.baseCurrency || USD);
    const context = this.resolvePricingContextFromCountryCode(
      params.countryCode,
      {
        fallbackCurrency: params.fallbackCurrency || baseCurrency,
      }
    );

    if (baseCurrency !== USD) {
      return {
        countryCode: context.countryCode,
        displayCurrency: baseCurrency,
        displayAmountMinor: params.usdAmountMinor,
        displayCurrencyExponent: getCurrencyExponent(baseCurrency),
        baseCurrency,
        baseAmountMinor: params.usdAmountMinor,
        exchangeRate: baseCurrency === context.currency ? 1 : null,
        rateDate: null,
        source: context.source,
      };
    }

    if (context.currency === USD) {
      return {
        countryCode: context.countryCode,
        displayCurrency: USD,
        displayAmountMinor: params.usdAmountMinor,
        displayCurrencyExponent: getCurrencyExponent(USD),
        baseCurrency: USD,
        baseAmountMinor: params.usdAmountMinor,
        exchangeRate: 1,
        rateDate: null,
        source: context.source,
      };
    }

    const ratesDoc = await this.getUsdExchangeRates();
    const exchangeRate = this.getUsdRate(context.currency, ratesDoc);

    if (!exchangeRate) {
      return {
        countryCode: context.countryCode,
        displayCurrency: USD,
        displayAmountMinor: params.usdAmountMinor,
        displayCurrencyExponent: getCurrencyExponent(USD),
        baseCurrency: USD,
        baseAmountMinor: params.usdAmountMinor,
        exchangeRate: null,
        rateDate: ratesDoc?.date || null,
        source: "fallback",
      };
    }

    const localizedAmountMinor = roundMinorToNearestIncrement(
      majorToMinor(
        minorToMajor(params.usdAmountMinor, USD) * exchangeRate,
        context.currency
      ),
      context.currency
    );

    return {
      countryCode: context.countryCode,
      displayCurrency: context.currency,
      displayAmountMinor: localizedAmountMinor,
      displayCurrencyExponent: getCurrencyExponent(context.currency),
      baseCurrency: USD,
      baseAmountMinor: params.usdAmountMinor,
      exchangeRate,
      rateDate: ratesDoc?.date || null,
      source: context.source,
    };
  }

  static async buildTherapistPriceSummaryForCountry(params: {
    hourlyRateUsdMinor: number;
    countryCode?: string | null;
    fallbackCurrency?: string;
    baseCurrency?: string;
    platformFeeUsdMinor?: number;
  }): Promise<TherapistPriceSummary> {
    const hourlyRatePresentation = await this.buildPricePresentationForCountry({
      usdAmountMinor: params.hourlyRateUsdMinor,
      countryCode: params.countryCode,
      fallbackCurrency: params.fallbackCurrency,
      baseCurrency: params.baseCurrency,
    });

    const basePlatformFeeUsdMinor =
      params.platformFeeUsdMinor ?? DEFAULT_PLATFORM_FEE_USD_MINOR;

    if (
      hourlyRatePresentation.displayCurrency === USD ||
      !hourlyRatePresentation.exchangeRate
    ) {
      return {
        countryCode: hourlyRatePresentation.countryCode,
        displayCurrency: hourlyRatePresentation.displayCurrency,
        displayHourlyRate: hourlyRatePresentation.displayAmountMinor,
        displayPlatformFee:
          hourlyRatePresentation.displayCurrency === USD
            ? basePlatformFeeUsdMinor
            : basePlatformFeeUsdMinor,
        displayHourlyTotal:
          hourlyRatePresentation.displayAmountMinor + basePlatformFeeUsdMinor,
        displayCurrencyExponent:
          hourlyRatePresentation.displayCurrencyExponent,
        baseCurrency: hourlyRatePresentation.baseCurrency,
        baseHourlyRate: hourlyRatePresentation.baseAmountMinor,
        basePlatformFeeUsd: basePlatformFeeUsdMinor,
        exchangeRate: hourlyRatePresentation.exchangeRate,
        rateDate: hourlyRatePresentation.rateDate,
        source: hourlyRatePresentation.source,
      };
    }

    const localizedPlatformFee = roundMinorToNearestIncrement(
      majorToMinor(
        calculateInverseCommissionMajor({
          baseCommissionUsd: minorToMajor(basePlatformFeeUsdMinor, USD),
          targetRate: hourlyRatePresentation.exchangeRate,
        }),
        hourlyRatePresentation.displayCurrency
      ),
      hourlyRatePresentation.displayCurrency
    );

    return {
      countryCode: hourlyRatePresentation.countryCode,
      displayCurrency: hourlyRatePresentation.displayCurrency,
      displayHourlyRate: hourlyRatePresentation.displayAmountMinor,
      displayPlatformFee: localizedPlatformFee,
      displayHourlyTotal:
        hourlyRatePresentation.displayAmountMinor + localizedPlatformFee,
      displayCurrencyExponent: hourlyRatePresentation.displayCurrencyExponent,
      baseCurrency: hourlyRatePresentation.baseCurrency,
      baseHourlyRate: hourlyRatePresentation.baseAmountMinor,
      basePlatformFeeUsd: basePlatformFeeUsdMinor,
      exchangeRate: hourlyRatePresentation.exchangeRate,
      rateDate: hourlyRatePresentation.rateDate,
      source: hourlyRatePresentation.source,
    };
  }
}

export function formatCurrencyAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizeCurrencyCode(currency),
  }).format(minorToMajor(amountMinor, currency));
}
