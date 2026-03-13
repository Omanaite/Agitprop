"use client";

import { useMemo, useState } from "react";
import type { Gallery, Tattoo } from "@/types";
import { GalleryGrid } from "@/components/GalleryGrid";

type Props = {
  tattoos: Tattoo[];
  galleries: Gallery[];
};

export function GalleryFilter({ tattoos, galleries }: Props) {
  const [selected, setSelected] = useState<string>("all");

  const filtered = useMemo(() => {
    if (selected === "all") return tattoos;
    return tattoos.filter((tattoo) => tattoo.gallery_id === selected);
  }, [selected, tattoos]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em]">
        <span>Filter</span>
        <select
          className="theme-border p-2"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="all">All</option>
          {galleries.map((gallery) => (
            <option key={gallery.id} value={gallery.id}>
              {gallery.title}
            </option>
          ))}
        </select>
      </div>
      <GalleryGrid tattoos={filtered} />
    </div>
  );
}
