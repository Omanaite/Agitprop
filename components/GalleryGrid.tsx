import type { Tattoo } from "@/types";

type GalleryGridProps = {
  tattoos: Tattoo[];
};

// Masonry-inspired layout with asymmetric columns per spec.
export function GalleryGrid({ tattoos }: GalleryGridProps) {
  if (tattoos.length === 0) {
    return (
      <p className="text-sm uppercase tracking-[0.2em]">
        No works found. Add tattoos in Supabase to populate the gallery.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_1fr]">
      {tattoos.map((tattoo) => (
        <article
          key={tattoo.id}
          className="hard-border flex flex-col gap-3 bg-white p-3"
        >
          <img
            className="tattoo-image h-64 w-full object-cover"
            src={tattoo.image_url}
            alt={tattoo.title}
            loading="lazy"
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
          </div>
        </article>
      ))}
    </div>
  );
}
