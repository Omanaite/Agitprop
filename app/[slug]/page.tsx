import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { GalleryFilter } from "@/components/GalleryFilter";
import { BookingForm } from "@/components/BookingForm";
import { ContactForm } from "@/components/ContactForm";
import { getArtistTenantBySlug } from "@/lib/data/artist-tenants";
import { getGalleries } from "@/lib/data/galleries";
import { getTattooGallery } from "@/lib/data/tattoos";
import { getPublishedPosts } from "@/lib/data/posts";
import { getHomepageSections } from "@/lib/data/homepage-sections";
import { getPublicDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import type { HomepageSection } from "@/types";

const RESERVED = new Set(["admin", "studio", "api", "register", "agitprop", "akemi", "galleries"]);

function getThemeClass(theme: string) {
  if (theme === "mono") return "artist-theme-mono";
  if (theme === "ink") return "artist-theme-ink";
  if (theme === "verdure") return "artist-theme-verdure";
  if (theme === "amber") return "artist-theme-amber";
  if (theme === "akemi_brutalist") return "artist-theme-akemi-brutalist";
  return "artist-theme-atelier";
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const tenant = await getArtistTenantBySlug(slug);
  if (!tenant) return {};
  return {
    title: `${tenant.studio_name} | Agitprop`,
    description: `Portfolio, booking, and studio updates for ${tenant.studio_name}.`,
    alternates: { canonical: `/${tenant.slug}` },
  };
}

export default async function ArtistSitePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const tenant = await getArtistTenantBySlug(slug);
  if (!tenant) notFound();

  const locale = await getRequestLocale();
  const dictionary = getPublicDictionary(locale);
  const sections = await getHomepageSections(locale, tenant.owner_user_id);
  const galleries = await getGalleries(tenant.owner_user_id);
  const tattoos = await getTattooGallery(tenant.owner_user_id);
  const posts = await getPublishedPosts(tenant.owner_user_id);
  const themeClass = getThemeClass(tenant.site_theme);

  const pieceCountByGallery = tattoos.reduce<Record<string, number>>((acc, t) => {
    if (t.gallery_id) acc[t.gallery_id] = (acc[t.gallery_id] ?? 0) + 1;
    return acc;
  }, {});

  type SectionRenderer = { render: (section: HomepageSection) => ReactNode };

  const renderers = new Map<string, SectionRenderer>([
    [
      "hero",
      {
        render: (section) => (
          <section key="hero" className="theme-border bg-[var(--bg)] px-6 py-10 md:px-10 md:py-14">
            {section.eyebrow ? (
              <p className="mb-4 text-xs uppercase tracking-[0.4em] opacity-60">{section.eyebrow}</p>
            ) : null}
            <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{section.title}</h2>
            <p className="max-w-2xl text-sm leading-7 opacity-75 md:text-base">
              {tenant.studio_name} — portfolio, bookings, and studio updates.
            </p>
          </section>
        ),
      },
    ],
    [
      "work",
      {
        render: (section) => (
          <Section key="work" id="work" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            <GalleryFilter
              tattoos={tattoos}
              galleries={galleries}
              filterLabel={dictionary.work.filter}
              allLabel={dictionary.work.all}
            />
          </Section>
        ),
      },
    ],
    [
      "galleries",
      {
        render: (section) => (
          <Section key="galleries" id="galleries" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            {galleries.length === 0 ? (
              <p className="text-sm opacity-60">No galleries published yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {galleries.map((gallery) => {
                  const count = pieceCountByGallery[gallery.id] ?? 0;
                  return (
                    <Link
                      key={gallery.id}
                      className="theme-border block rounded-xl p-5 transition-opacity hover:opacity-75"
                      href={`/${slug}/gallery/${gallery.slug}`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] opacity-60">{gallery.slug}</p>
                      <h3 className="mt-2 text-lg font-semibold">{gallery.title}</h3>
                      {gallery.description ? (
                        <p className="mt-1 text-sm opacity-70 line-clamp-2">{gallery.description}</p>
                      ) : null}
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] opacity-50">
                        {count} {count === 1 ? "piece" : "pieces"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </Section>
        ),
      },
    ],
    [
      "about",
      {
        render: (section) => (
          <Section key="about" id="about" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            <p className="max-w-2xl text-sm leading-7 opacity-80 md:text-base">
              {tenant.studio_name} — independent artist. Portfolio available here.
              For commissions, collaborations, and inquiries, use the booking or contact section.
            </p>
          </Section>
        ),
      },
    ],
    [
      "rates",
      {
        render: (section) => (
          <Section key="rates" id="rates" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Small piece", price: "From €100", detail: "Up to 2h session" },
                { label: "Medium piece", price: "From €200", detail: "2–4h session" },
                { label: "Large piece", price: "From €400", detail: "Full day, 6h+" },
              ].map((card) => (
                <div key={card.label} className="theme-border rounded-xl p-5">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold">{card.price}</p>
                  <p className="mt-1 text-sm opacity-60">{card.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] opacity-60">
              50% deposit required to confirm booking. Final price agreed at consultation.
            </p>
          </Section>
        ),
      },
    ],
    [
      "booking",
      {
        render: (section) => (
          <Section key="booking" id="booking" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            <BookingForm copy={dictionary.booking} tenantSlug={tenant.slug} />
          </Section>
        ),
      },
    ],
    [
      "contact",
      {
        render: (section) => (
          <Section key="contact" id="contact" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            <ContactForm copy={dictionary.contact} tenantSlug={tenant.slug} />
          </Section>
        ),
      },
    ],
    [
      "posts",
      {
        render: (section) => (
          <Section key="posts" id="posts" title={section.title} eyebrow={section.eyebrow ?? undefined}>
            {posts.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                  <article key={post.id} className="theme-border rounded-xl p-5">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="mt-2 text-sm opacity-75 line-clamp-3">{post.excerpt || post.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm opacity-60">No posts published yet.</p>
            )}
          </Section>
        ),
      },
    ],
  ]);

  const visibleSections = sections.filter((s) => s.is_visible);

  return (
    <div className={`min-h-screen p-4 md:p-8 ${themeClass}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          sections={visibleSections}
          locale={locale}
          brandEyebrow="Artist Site"
          brandTitle={tenant.studio_name}
          themeLabels={dictionary.theme}
          localeLabel={dictionary.locale.label}
        />
        {visibleSections.map((section) =>
          renderers.get(section.section_key)?.render(section)
        )}
        <Footer
          studioLabel={tenant.studio_name}
          copyrightLabel={`© ${new Date().getFullYear()} ${tenant.studio_name}`}
        />
      </div>
    </div>
  );
}
