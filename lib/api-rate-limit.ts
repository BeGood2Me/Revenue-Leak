import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const HOUR_MS = 60 * 60 * 1000;

const LIMITS = {
  "diagnostic:create": { limit: 30, windowMs: HOUR_MS },
  "diagnostic:update": { limit: 60, windowMs: HOUR_MS },
  "diagnostic:read": { limit: 120, windowMs: HOUR_MS },
  "checkout:create": { limit: 15, windowMs: HOUR_MS },
} as const;

export type RateLimitBucket = keyof typeof LIMITS;

export function enforceRateLimit(
  request: Request,
  bucket: RateLimitBucket
): NextResponse | null {
  const { limit, windowMs } = LIMITS[bucket];
  const ip = getClientIp(request);
  const result = rateLimit(`${bucket}:${ip}`, limit, windowMs);

  if (result.ok) {
    return null;
  }

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfter) },
    }
  );
}
