"use client";

import { useEffect, useState } from "react";
import { useStudioPreview } from "@/lib/studio-preview-context";
import { StudioPreviewPanel } from "@/components/studio/StudioPreviewPanel";

type Device = "desktop" | "tablet" | "mobile";

type Props = {
  children: React.ReactNode;
};

/**
 * StudioSplitLayout
 *
 * Wraps the studio console. When split-screen is active, renders:
 *   Left 50%: studio panel (children)
 *   Right 50%: live preview iframe
 *
 * The split button lives in the header and toggles the layout.
 * On screens < 1280px, split is hidden (not enough space).
 */
export function StudioSplitLayout({ children }: Props) {
  const { splitActive, setSplitActive, slug } = useStudioPreview();
  const [device, setDevice] = useState<Device>("desktop");
  const [isWide, setIsWide] = useState(false);

  // Only allow split on wide screens
  useEffect(() => {
    function check() {
      setIsWide(window.innerWidth >= 1280);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showSplit = splitActive && isWide && !!slug;

  return (
    <div className="flex flex-1 min-h-0 w-full relative">
      {/* Split toggle — floats over top-right of content */}
      {isWide && !!slug && (
        <button
          onClick={() => setSplitActive(!splitActive)}
          className="admin-button admin-button-ghost flex items-center gap-2"
          title={splitActive ? "Close preview" : "Open live preview"}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            zIndex: 10,
            fontSize: "0.75rem",
            padding: "0.35rem 0.75rem",
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>{splitActive ? "▣" : "▤"}</span>
          {splitActive ? "Close preview" : "Preview site"}
        </button>
      )}

      {showSplit ? (
        <>
          <div className="w-1/2 min-h-0 overflow-y-auto" style={{ borderRight: "1px solid var(--admin-border)" }}>
            {children}
          </div>
          <div className="w-1/2 min-h-0">
            <StudioPreviewPanel
              device={device}
              onDeviceChange={setDevice}
              onClose={() => setSplitActive(false)}
            />
          </div>
        </>
      ) : (
        <div className="flex-1 min-h-0 min-w-0">
          {children}
        </div>
      )}
    </div>
  );
}
