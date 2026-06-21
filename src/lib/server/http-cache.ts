import { NextResponse } from "next/server";

type CacheConfig = {
  sMaxAge: number;
  staleWhileRevalidate?: number;
  vary?: string[];
};

export function applyCacheHeaders<T>(
  response: NextResponse<T>,
  config: CacheConfig
) {
  const directives = [`public`, `s-maxage=${config.sMaxAge}`];

  if (config.staleWhileRevalidate) {
    directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  response.headers.set("Cache-Control", directives.join(", "));

  if (config.vary?.length) {
    response.headers.set("Vary", config.vary.join(", "));
  }

  return response;
}
