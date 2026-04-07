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
    <div className="relative flex flex-col gap-0 flex-1">
      {/* Split toggle button — only shown on wide screens with a slug */}
      {isWide && !!slug && (
        <div className="flex justify-end pb-3">
          <button
            onClick={() => setSplitActive(!splitActive)}
            className="admin-button admin-button-ghost flex items-center gap-2 text-xs"
            title={splitActive ? "Close preview" : "Open live preview"}
          >
            <span className="text-base leading-none">{splitActive ? "▣" : "▤"}</span>
            {splitActive ? "Close preview" : "Preview site"}
          </button>
        </div>
      )}

      {/* Layout */}
      {showSplit ? (
        <div className="flex h-[calc(100vh-160px)] min-h-[600px] gap-0 rounded-sm overflow-hidden border border-current/10">
          {/* Left: studio panel */}
          <div className="w-1/2 overflow-y-auto">
            {children}
          </div>
          {/* Right: live preview */}
          <div className="w-1/2">
            <StudioPreviewPanel
              device={device}
              onDeviceChange={setDevice}
              onClose={() => setSplitActive(false)}
            />
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
