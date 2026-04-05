"use client";

import Image from "next/image";
import { useState } from "react";
import type { Tattoo } from "@/types";

type GalleryGridProps = {
  tattoos: Tattoo[];
};

function PieceModal({ tattoo, onClose }: { tattoo: Tattoo; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="hard-border relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[var(--bg)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
          onClick={onClose}
          aria-label="Close"
        >
          ✕ Close
        </button>

        <Image
          className="w-full object-cover"
          src={tattoo.image_url}
          alt={tattoo.title}
          width={960}
          height={720}
          sizes="(max-width: 768px) 100vw, 672px"
        />

        <div className="mt-5 grid gap-3">
          <div>
            <h3 className="font-[var(--font-heading)] text-2xl uppercase">{tattoo.title}</h3>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">{tattoo.style}</p>
          </div>

          {tattoo.description ? (
            <p className="text-sm leading-6 opacity-80">{tattoo.description}</p>
          ) : null}

          <div className="mt-2 grid gap-2 text-xs uppercase tracking-[0.18em] opacity-70">
            {tattoo.tags && tattoo.tags.length > 0 ? (
              <p>
                <span className="font-semibold">Tags:</span>{" "}
                {tattoo.tags.join(" · ")}
              </p>
            ) : null}
            {tattoo.session_length_minutes ? (
              <p>
                <span className="font-semibold">Duration:</span>{" "}
                {tattoo.session_length_minutes >= 60
                  ? `${Math.floor(tattoo.session_length_minutes / 60)}h${tattoo.session_length_minutes % 60 ? ` ${tattoo.session_length_minutes % 60}min` : ""}`
                  : `${tattoo.session_length_minutes} min`}
              </p>
            ) : null}
            {tattoo.location_link ? (
              <p>
                <a
                  href={tattoo.location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-100"
                >
                  {tattoo.location_name ? tattoo.location_name : "View location"} ↗
                </a>
              </p>
            ) : null}
          </div>
          {tattoo.aftercare ? (
            <p className="mt-4 border-t border-current/10 pt-4 text-sm leading-6 opacity-70 normal-case tracking-normal">
              <span className="text-xs uppercase tracking-[0.18em] opacity-60 block mb-1">Notes</span>
              {tattoo.aftercare}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function GalleryGrid({ tattoos }: GalleryGridProps) {
  const [selected, setSelected] = useState<Tattoo | null>(null);

  if (tattoos.length === 0) {
    return (
      <p className="text-sm uppercase tracking-[0.2em]">
        The archive is being updated. Check back soon for new work.
      </p>
    );
  }

  return (
    <>
      {selected ? <PieceModal tattoo={selected} onClose={() => setSelected(null)} /> : null}
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_1fr]">
        {tattoos.map((tattoo) => (
          <article
            key={tattoo.id}
            className="hard-border flex cursor-pointer flex-col gap-3 bg-[var(--bg)] p-3 transition-opacity hover:opacity-80"
            onClick={() => setSelected(tattoo)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(tattoo)}
            aria-label={`View details for ${tattoo.title}`}
          >
            <Image
              className="tattoo-image h-64 w-full object-cover"
              src={tattoo.image_url}
              alt={tattoo.title}
              width={960}
              height={720}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div>
              <h3 className="font-[var(--font-heading)] text-xl uppercase">
                {tattoo.title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em]">
                {tattoo.style}
              </p>
              {tattoo.description ? (
                <p className="mt-2 text-sm">{tattoo.description}</p>
              ) : null}
              <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-40">
                Tap to view details
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
