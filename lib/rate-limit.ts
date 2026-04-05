type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  reset: number;
};

const buckets = new Map<string, { count: number; reset: number }>();

// Prune expired entries to prevent unbounded memory growth in long-lived instances.
function pruneExpired(now: number) {
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.reset < now) buckets.delete(k);
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);
  const existing = buckets.get(key);

  if (!existing || existing.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, reset: existing.reset };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    reset: existing.reset,
  };
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function getClientIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}
