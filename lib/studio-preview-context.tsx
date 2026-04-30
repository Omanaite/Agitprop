"use client";

/**
 * StudioPreviewContext
 *
 * Provides a global `refreshPreview()` function that any save action
 * in the studio can call to trigger a reload of the live preview iframe.
 *
 * Usage in any studio component after saving:
 *   const { refreshPreview } = useStudioPreview();
 *   await save();
 *   refreshPreview();
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PREVIEW_CHANNEL = "agitprop-preview-refresh";

type StudioPreviewContextValue = {
  /** Call after any save to reload the preview iframe. */
  refreshPreview: () => void;
  /** Increments on each refresh — iframe uses this as key to force reload. */
  previewKey: number;
  /** Whether split-screen is currently active. */
  splitActive: boolean;
  setSplitActive: (v: boolean) => void;
  /** The artist's public slug — used to build the preview URL. */
  slug: string | null;
  setSlug: (slug: string) => void;
};

const StudioPreviewContext = createContext<StudioPreviewContextValue>({
  refreshPreview: () => {},
  previewKey: 0,
  splitActive: false,
  setSplitActive: () => {},
  slug: null,
  setSlug: () => {},
});

export function StudioPreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewKey, setPreviewKey] = useState(0);
  const [splitActive, setSplitActive] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(PREVIEW_CHANNEL);
    return () => channelRef.current?.close();
  }, []);

  function refreshPreview() {
    // Broadcast to the iframe so it can reload without full remount
    channelRef.current?.postMessage({ type: "refresh" });
    // Fallback: increment key in case iframe isn't listening yet (first open)
    setPreviewKey((k) => k + 1);
  }

  return (
    <StudioPreviewContext.Provider
      value={{ refreshPreview, previewKey, splitActive, setSplitActive, slug, setSlug }}
    >
      {children}
    </StudioPreviewContext.Provider>
  );
}

export function useStudioPreview() {
  return useContext(StudioPreviewContext);
}
