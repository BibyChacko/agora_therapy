import { NextRequest, NextResponse } from "next/server";

type RateLimitConfig = {
  keyPrefix: string;
  windowMs: number;
  maxRequests: number;
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, RateLimitRecord> | undefined;
}

const rateLimitStore = globalThis.__rateLimitStore ?? new Map<string, RateLimitRecord>();

if (!globalThis.__rateLimitStore) {
  globalThis.__rateLimitStore = rateLimitStore;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function runRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const ip = getClientIp(request);
  const pathname = request.nextUrl.pathname;
  const key = `${config.keyPrefix}:${pathname}:${ip}`;
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
      retryAfterSeconds: Math.ceil(config.windowMs / 1000),
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  const remaining = Math.max(config.maxRequests - existing.count, 0);

  return {
    allowed: existing.count <= config.maxRequests,
    limit: config.maxRequests,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000)
    ),
  };
}

function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
) {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.floor(result.resetAt / 1000))
  );

  if (!result.allowed) {
    response.headers.set("Retry-After", String(result.retryAfterSeconds));
  }

  return response;
}

export function createRateLimitResponse(
  request: NextRequest,
  config: RateLimitConfig
) {
  const result = runRateLimit(request, config);

  if (result.allowed) {
    return {
      ok: true as const,
      headers: {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
      },
    };
  }

  const response = NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    { status: 429 }
  );

  applyRateLimitHeaders(response, result);

  return {
    ok: false as const,
    response,
  };
}
