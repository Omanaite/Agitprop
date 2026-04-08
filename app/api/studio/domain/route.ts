import { NextResponse } from "next/server";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN ?? "";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "";
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID ?? ""; // optional

function vercelHeaders() {
  return {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function vercelBase(path: string) {
  const team = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : "";
  return `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains${path}${team}`;
}

function isValidDomain(domain: string) {
  // Basic domain validation: letters, digits, hyphens, dots. No protocol, no path.
  return /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(domain);
}

async function authAndRate(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) return { error: NextResponse.json({ message: "Invalid origin." }, { status: 403 }) };

  const ip = getClientIp(request);
  const limit = rateLimit(`studio-domain:${ip}`, 10, 60_000);
  if (!limit.allowed) return { error: NextResponse.json({ message: "Too many requests." }, { status: 429 }) };

  const auth = await requireArtistOperator();
  if (!auth.ok || !auth.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  return { user: auth.user };
}

/** GET — returns current domain + Vercel verification status */
export async function GET(request: Request) {
  const result = await authAndRate(request);
  if ("error" in result) return result.error;
  const { user } = result;

  const adminClient = createSupabaseServerClient();
  const { data: tenant } = await adminClient
    .from("artist_tenants")
    .select("custom_domain")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  const domain = tenant?.custom_domain ?? null;
  if (!domain) return NextResponse.json({ domain: null });

  // Fetch verification status from Vercel if token is configured
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ domain, vercel: null, note: "Vercel API not configured." });
  }

  try {
    const res = await fetch(vercelBase(`/${domain}`), { headers: vercelHeaders() });
    const data = await res.json();
    return NextResponse.json({
      domain,
      vercel: {
        verified: data.verified ?? false,
        verification: data.verification ?? [],
        configured: data.misconfigured === false,
      },
    });
  } catch {
    return NextResponse.json({ domain, vercel: null });
  }
}

/** PATCH — set or update custom domain */
export async function PATCH(request: Request) {
  const result = await authAndRate(request);
  if ("error" in result) return result.error;
  const { user } = result;

  let body: { domain?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const domain = (body.domain ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (!isValidDomain(domain)) {
    return NextResponse.json({ message: "Invalid domain format. Enter a bare domain like myclient.com." }, { status: 400 });
  }

  const adminClient = createSupabaseServerClient();

  // Check the domain isn't already used by another tenant
  const { data: existing } = await adminClient
    .from("artist_tenants")
    .select("owner_user_id")
    .eq("custom_domain", domain)
    .neq("owner_user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ message: "That domain is already linked to another site." }, { status: 409 });
  }

  // Register with Vercel if configured
  let vercelResult: Record<string, unknown> | null = null;
  if (VERCEL_TOKEN && VERCEL_PROJECT_ID) {
    try {
      const res = await fetch(vercelBase(""), {
        method: "POST",
        headers: vercelHeaders(),
        body: JSON.stringify({ name: domain }),
      });
      vercelResult = await res.json();
      // 409 from Vercel means domain already added to project — fine, continue
      if (!res.ok && res.status !== 409) {
        const msg = (vercelResult as { error?: { message?: string } })?.error?.message ?? "Failed to register domain with Vercel.";
        return NextResponse.json({ message: msg }, { status: 502 });
      }
    } catch {
      return NextResponse.json({ message: "Could not reach Vercel API. Try again later." }, { status: 502 });
    }
  }

  // Save to DB
  const { error } = await adminClient
    .from("artist_tenants")
    .update({ custom_domain: domain })
    .eq("owner_user_id", user.id);

  if (error) {
    return NextResponse.json({ message: "Failed to save domain." }, { status: 500 });
  }

  await logAuditEvent({
    actor_email: user.email ?? null,
    action: "update",
    entity: "artist_tenants",
    entity_id: user.id,
    metadata: { custom_domain: domain },
  });

  // Return Vercel DNS instructions if available
  const verification = (vercelResult as { verification?: unknown[] } | null)?.verification ?? [];
  return NextResponse.json({
    ok: true,
    domain,
    verification,
    note: !VERCEL_TOKEN ? "Vercel API not configured — domain saved to DB only." : undefined,
  });
}

/** DELETE — remove custom domain */
export async function DELETE(request: Request) {
  const result = await authAndRate(request);
  if ("error" in result) return result.error;
  const { user } = result;

  const adminClient = createSupabaseServerClient();
  const { data: tenant } = await adminClient
    .from("artist_tenants")
    .select("custom_domain")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  const domain = tenant?.custom_domain;

  if (!domain) {
    return NextResponse.json({ ok: true }); // nothing to remove
  }

  // Remove from Vercel
  if (VERCEL_TOKEN && VERCEL_PROJECT_ID) {
    try {
      await fetch(vercelBase(`/${domain}`), { method: "DELETE", headers: vercelHeaders() });
    } catch {
      // non-fatal — proceed to clear from DB
    }
  }

  await adminClient
    .from("artist_tenants")
    .update({ custom_domain: null })
    .eq("owner_user_id", user.id);

  await logAuditEvent({
    actor_email: user.email ?? null,
    action: "delete",
    entity: "artist_tenants",
    entity_id: user.id,
    metadata: { custom_domain: domain },
  });

  return NextResponse.json({ ok: true });
}
