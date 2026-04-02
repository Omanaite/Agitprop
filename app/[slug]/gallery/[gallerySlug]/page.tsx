import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { getArtistTenantBySlug } from "@/lib/data/artist-tenants";
import { getGalleryBySlug } from "@/lib/data/galleries";
import { getTattoosByGalleryId } from "@/lib/data/tattoos";
import { getHomepageSections } from "@/lib/data/homepage-sections";
import { getPublicDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { getSiteUrl } from "@/lib/site-url";

const RESERVED = new Set(["admin", "studio", "api", "register", "agitprop", "akemi", "galleries"]);

function getThemeClass(theme: string) {
  if (theme === "mono") return "artist-theme-mono";
  if (theme === "ink") return "artist-theme-ink";
  if (theme === "verdure") return "artist-theme-verdure";
  if (theme === "amber") return "artist-theme-amber";
  if (theme === "akemi_brutalist") return "artist-theme-akemi-brutalist";
  return "artist-theme-atelier";
}

type Params = { slug: string; gallerySlug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, gallerySlug } = await params;
  if (RESERVED.has(slug)) return {};

  const tenant = await getArtistTenantBySlug(slug);
  if (!tenant) return {};

  const gallery = await getGalleryBySlug(gallerySlug, tenant.owner_user_id);
  if (!gallery) return {};

  const description =
    gallery.description ||
    `Explore ${gallery.title} from ${tenant.studio_name} on Agitprop.`;

  return {
    title: `${gallery.title} | ${tenant.studio_name}`,
    description,
    alternates: { canonical: `/${slug}/gallery/${gallerySlug}` },
    openGraph: {
      title: `${gallery.title} | ${tenant.studio_name}`,
      description,
      url: `${getSiteUrl()}/${slug}/gallery/${gallerySlug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${gallery.title} | ${tenant.studio_name}`,
      description,
    },
  };
}

export default async function TenantGalleryDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, gallerySlug } = await params;
  if (RESERVED.has(slug)) notFound();

  const tenant = await getArtistTenantBySlug(slug);
  if (!tenant) notFound();

  const gallery = await getGalleryBySlug(gallerySlug, tenant.owner_user_id);
  if (!gallery) notFound();

  const locale = await getRequestLocale();
  const dictionary = getPublicDictionary(locale);
  const sections = await getHomepageSections(locale, tenant.owner_user_id);
  const tattoos = await getTattoosByGalleryId(gallery.id, tenant.owner_user_id);
  const themeClass = getThemeClass(tenant.site_theme);

  const styles = Array.from(
    new Set(tattoos.map((t) => t.style).filter(Boolean))
  );
  const totalSessionMinutes = tattoos.reduce(
    (sum, t) => sum + (t.session_length_minutes ?? 0),
    0
  );
  const approxHours =
    totalSessionMinutes > 0
      ? Math.round((totalSessionMinutes / 60) * 10) / 10
      : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: gallery.title,
    description:
      gallery.description ||
      `Curated gallery from ${tenant.studio_name} with ${tattoos.length} published pieces.`,
    url: `${getSiteUrl()}/${slug}/gallery/${gallerySlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: tenant.studio_name,
      url: `${getSiteUrl()}/${slug}`,
    },
    about: styles.map((style) => ({ "@type": "Thing", name: style })),
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${themeClass}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          sections={sections.filter((s) => s.is_visible)}
          locale={locale}
          brandEyebrow="Artist Site"
          brandTitle={tenant.studio_name}
          themeLabels={dictionary.theme}
          localeLabel={dictionary.locale.label}
        />

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
          <Link
            href={`/${slug}#galleries`}
            className="mt-4 inline-flex theme-border px-4 py-2 text-xs uppercase tracking-[0.2em]"
          >
            Back to galleries
          </Link>
        </Section>

        <Section id="work" title="Pieces" eyebrow="Gallery">
          <GalleryGrid tattoos={tattoos} />
        </Section>

        <Footer
          studioLabel={tenant.studio_name}
          copyrightLabel={`© ${new Date().getFullYear()} ${tenant.studio_name}`}
        />
      </div>
    </div>
  );
}
