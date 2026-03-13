export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  if (!host) return false;

  const normalizedOrigin = origin.replace(/^https?:\/\//, "");
  return normalizedOrigin === host;
}

export function enforceSameOrigin(request: Request) {
  if (process.env.NODE_ENV !== "production") return { ok: true };
  return { ok: isSameOrigin(request) };
}

