"use client";

import { useEffect } from "react";
import { PREVIEW_CHANNEL } from "@/lib/studio-preview-context";

/**
 * Listens for BroadcastChannel messages from the studio split-screen
 * and reloads the page when a "refresh" message is received.
 * Only active when the page is loaded inside an iframe (window !== top).
 */
export function PreviewRefreshListener() {
  useEffect(() => {
    if (window === window.top) return; // not inside an iframe — no-op
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.onmessage = (e) => {
      if (e.data?.type === "refresh") {
        window.location.reload();
      }
    };
    return () => channel.close();
  }, []);

  return null;
}
