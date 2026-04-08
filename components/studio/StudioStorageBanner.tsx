"use client";

import { useEffect, useState } from "react";

/**
 * StudioStorageBanner
 *
 * Shows the artist's current storage tier and, for basic-tier artists,
 * a gentle note explaining how to expand their space.
 * No upsell language — just honest info about the community model.
 */
export function StudioStorageBanner() {
  const [planCode, setPlanCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/studio/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.profile?.plan_code) setPlanCode(json.profile.plan_code);
      })
      .catch(() => {});
  }, []);

  if (!planCode) return null;

  const isExpanded = planCode === "expanded";

  if (isExpanded) {
    return (
      <div className="admin-chip inline-flex items-center gap-2 text-xs">
        <span className="opacity-60">Storage:</span>
        <span>Expanded — unlimited galleries, posts &amp; pieces</span>
      </div>
    );
  }

  return (
    <div className="rounded border border-current/10 bg-current/5 px-4 py-3 text-xs leading-6 opacity-80">
      <strong>Basic storage tier</strong> — up to 2 galleries, 25 pieces, 5 posts.{" "}
      <span className="opacity-70">
        Agitprop is a free community service. If you need more space and would like
        to contribute to hosting costs, contact us to discuss expanded access.
      </span>
    </div>
  );
}
