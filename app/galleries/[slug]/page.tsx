import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Header } from "@/components/Header";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getGalleryBySlug } from "@/lib/data/galleries";
import { getTattoosByGalleryId } from "@/lib/data/tattoos";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    return {
      title: "Gallery Not Found | Akemi Tattoo",
    };
  }

  const tattoos = await getTattoosByGalleryId(gallery.id);
  const styles = Array.from(
    new Set(tattoos.map((item) => item.style).filter(Boolean))
  );
  const description =
    gallery.description ||
    `Explore ${gallery.title} in the Akemi Tattoo portfolio with ${tattoos.length} published pieces across ${styles.join(", ") || "multiple tattoo styles"}.`;

  return {
    title: `${gallery.title} | Akemi Tattoo`,
    description,
    alternates: {
      canonical: `/galleries/${gallery.slug}`,
    },
    openGraph: {
      title: `${gallery.title} | Akemi Tattoo`,
      description,
      url: `${getSiteUrl()}/galleries/${gallery.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${gallery.title} | Akemi Tattoo`,
      description,
    },
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) {
    notFound();
  }
  const tattoos = await getTattoosByGalleryId(gallery.id);
  const styles = Array.from(
    new Set(tattoos.map((item) => item.style).filter(Boolean))
  );
  const totalSessionMinutes = tattoos.reduce(
    (sum, tattoo) => sum + (tattoo.session_length_minutes ?? 0),
    0
  );
  const approxHours =
    totalSessionMinutes > 0 ? Math.round((totalSessionMinutes / 60) * 10) / 10 : null;

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--fg)] md:p-8">
      <NoiseOverlay />
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header />
        <Reveal>
          <Section id="gallery" title={gallery.title} eyebrow="Gallery">
            {gallery.description ? (
              <p className="text-sm md:text-base">{gallery.description}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <span className="theme-border-thin px-3 py-1 text-xs uppercase tracking-[0.18em]">
                {tattoos.length} pieces
              </span>
              {styles.slice(0, 3).map((style) => (
                <span
                  key={style}
                  className="theme-border-thin px-3 py-1 text-xs uppercase tracking-[0.18em]"
                >
                  {style}
                </span>
              ))}
              {approxHours ? (
                <span className="theme-border-thin px-3 py-1 text-xs uppercase tracking-[0.18em]">
                  approx. {approxHours}h documented
                </span>
              ) : null}
            </div>
            <p className="max-w-3xl text-sm leading-7 md:text-base">
              This gallery groups related tattoo pieces from the Akemi studio
              archive so visitors can understand motif direction, line weight,
              and recurring style decisions in one place.
            </p>
            <Link
              href="/#galleries"
              className="mt-4 inline-flex theme-border px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              Back to galleries
            </Link>
          </Section>
        </Reveal>
        <Reveal>
          <Section id="work" title="Pieces" eyebrow="Gallery">
            <GalleryGrid tattoos={tattoos} />
          </Section>
        </Reveal>
        <Footer />
      </div>
    </div>
  );
}
