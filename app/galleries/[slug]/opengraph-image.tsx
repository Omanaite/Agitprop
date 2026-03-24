import { ImageResponse } from "next/og";
import { getGalleryBySlug } from "@/lib/data/galleries";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function GalleryOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  const title = gallery?.title ?? "Akemi Gallery";
  const description = gallery?.description ??
    "Curated tattoo pieces from the Akemi archive.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08111f",
          color: "#f8fafc",
          padding: "56px",
          border: "8px solid #7aa2ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 10, textTransform: "uppercase", color: "#7aa2ff" }}>
          Gallery
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 26, maxWidth: 860, lineHeight: 1.35 }}>
            {description}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 20, textTransform: "uppercase" }}>
          <div style={{ display: "flex", border: "2px solid #7aa2ff", padding: "10px 16px" }}>Berlin</div>
          <div style={{ display: "flex", border: "2px solid #7aa2ff", padding: "10px 16px" }}>Tattoo Portfolio</div>
        </div>
      </div>
    ),
    size
  );
}
