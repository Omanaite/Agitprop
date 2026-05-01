"use client";

import { useStudioPreview } from "@/lib/studio-preview-context";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

type Props = {
  device: Device;
  onDeviceChange: (d: Device) => void;
  onClose: () => void;
};

export function StudioPreviewPanel({ device, onDeviceChange, onClose }: Props) {
  const { previewKey, slug } = useStudioPreview();

  const previewUrl = slug ? `/${slug}` : "/";

  return (
    <div className="flex h-full flex-col border-l border-current/10 bg-[var(--bg)]">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-current/10 px-3 py-2">
        <span className="text-xs uppercase tracking-[0.15em] opacity-50 mr-auto">
          Live preview
        </span>

        {/* Device selector */}
        <div className="flex gap-1">
          {(["desktop", "tablet", "mobile"] as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => onDeviceChange(d)}
              title={d}
              className={`rounded px-2 py-1 text-xs uppercase tracking-[0.12em] transition-opacity ${
                device === d ? "opacity-100 underline" : "opacity-40 hover:opacity-70"
              }`}
            >
              {d === "desktop" ? "↔" : d === "tablet" ? "▭" : "☐"}
            </button>
          ))}
        </div>

        {/* Open in new tab */}
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs opacity-40 hover:opacity-80 transition-opacity"
          title="Open in new tab"
        >
          ↗
        </a>

        {/* Close split */}
        <button
          onClick={onClose}
          className="text-xs opacity-40 hover:opacity-80 transition-opacity"
          title="Close preview"
        >
          ✕
        </button>
      </div>

      {/* iframe container */}
      <div className="flex flex-1 overflow-hidden items-start justify-center bg-[var(--fg)]/5 p-2">
        <div
          className="relative h-full overflow-hidden bg-white shadow-lg"
          style={{ width: DEVICE_WIDTHS[device], maxWidth: "100%", transition: "width 300ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <iframe
            key={previewKey}
            src={previewUrl}
            title="Site preview"
            className="h-full w-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
          {/* Read-only overlay — prevents clicks navigating away from the preview */}
          <div className="absolute inset-0" style={{ pointerEvents: "all" }} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
