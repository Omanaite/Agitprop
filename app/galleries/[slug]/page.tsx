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

  const description =
    gallery.description ||
    `Explore ${gallery.title} in the Akemi Tattoo portfolio.`;

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
