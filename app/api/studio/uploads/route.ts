import { NextResponse } from "next/server";
import { requireArtistOperator } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: Request) {
  const originCheck = enforceSameOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }
  const ip = getClientIp(request);
  const limit = rateLimit(`studio-upload:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }
  const auth = await requireArtistOperator();
  if (!auth.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const adminClient = createSupabaseServerClient();

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { message: "File too large. Max 5MB." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image uploads are allowed." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `studio/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await adminClient.storage
    .from("gallery")
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (error) {
    return NextResponse.json(
      { message: "Upload failed." },
      { status: 500 }
    );
  }

  const { data } = adminClient.storage.from("gallery").getPublicUrl(path);

  await logAuditEvent({
    actor_email: auth.user?.email ?? null,
    action: "upload",
    entity: "gallery",
    metadata: { path },
  });

  return NextResponse.json({ url: data.publicUrl });
}


