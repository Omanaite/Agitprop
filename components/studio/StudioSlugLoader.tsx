"use client";

import { useEffect } from "react";
import { useStudioPreview } from "@/lib/studio-preview-context";

/**
 * Injects the artist's slug into the preview context on mount.
 * This is a server-component-friendly bridge — the slug is resolved
 * server-side in StudioPage and passed as a prop here.
 */
export function StudioSlugLoader({ slug }: { slug: string }) {
  const { setSlug } = useStudioPreview();
  useEffect(() => {
    setSlug(slug);
  }, [slug, setSlug]);
  return null;
}
