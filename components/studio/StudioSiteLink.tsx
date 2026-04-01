"use client";

import { useEffect, useState } from "react";

export function StudioSiteLink() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/studio/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.profile?.slug) setSlug(json.profile.slug);
      })
      .catch(() => {});
  }, []);

  if (!slug) return null;

  const href = `/${slug}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="admin-button admin-button-ghost inline-flex items-center gap-2 text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path
          fillRule="evenodd"
          d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.5-3.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V4.56l-6.22 6.22a.75.75 0 1 1-1.06-1.06l6.22-6.22H12.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        />
      </svg>
      View my site
    </a>
  );
}
