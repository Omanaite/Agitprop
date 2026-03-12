import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`admin-upload:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    );
  }
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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
  const path = `admin/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await auth.supabase.storage
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

  const { data } = auth.supabase.storage.from("gallery").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
