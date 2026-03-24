import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          color: "#162033",
          padding: "56px",
          border: "8px solid #162033",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 10, textTransform: "uppercase" }}>
          Akemi
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95 }}>
            <div style={{ display: "flex" }}>Tattoo</div>
            <div style={{ display: "flex" }}>Manifesto</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, maxWidth: 760, lineHeight: 1.35 }}>
            Berlin tattoo portfolio, curated galleries, bookings, and studio notes.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 20, textTransform: "uppercase" }}>
          <div style={{ display: "flex", border: "2px solid #162033", padding: "10px 16px" }}>Portfolio</div>
          <div style={{ display: "flex", border: "2px solid #162033", padding: "10px 16px" }}>Bookings</div>
          <div style={{ display: "flex", border: "2px solid #162033", padding: "10px 16px" }}>Studio Notes</div>
        </div>
      </div>
    ),
    size
  );
}
