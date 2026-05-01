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

import { createContext, useContext, useState } from "react";

export const PREVIEW_CHANNEL = "agitprop-preview-refresh";

type StudioPreviewContextValue = {
  refreshPreview: () => void;
  previewKey: number;
  splitActive: boolean;
  setSplitActive: (v: boolean) => void;
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

  function refreshPreview() {
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
