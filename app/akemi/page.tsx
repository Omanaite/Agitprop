import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { BookingForm } from "@/components/BookingForm";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { GalleryFilter } from "@/components/GalleryFilter";
import { Header } from "@/components/Header";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { PaymentButtons } from "@/components/PaymentButtons";
import { PriceCards } from "@/components/PriceCards";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getGalleries } from "@/lib/data/galleries";
import { getHomepageSections } from "@/lib/data/homepage-sections";
import { getArtistTenantBySlug } from "@/lib/data/artist-tenants";
import { getPublicDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { getPublishedPosts } from "@/lib/data/posts";
import { getTattooGallery } from "@/lib/data/tattoos";
import type { HomepageSection } from "@/types";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dictionary = getPublicDictionary(locale);
  const descriptionMap = {
    en: "Berlin tattoo portfolio, booking portal, curated galleries, and studio notes from Akemi.",
    es: "Portfolio de tatuajes en Berlin, reservas, galerias curadas y notas de estudio de Akemi.",
    de: "Tattoo-Portfolio aus Berlin mit Buchung, kuratierten Galerien und Studio-Notizen von Akemi.",
  } as const;

  return {
    title: "Akemi Tattoo Manifesto",
    description: descriptionMap[locale],
    alternates: {
      canonical: "/akemi",
    },
    openGraph: {
      title: dictionary.brand.title,
      description: descriptionMap[locale],
      url: `${getSiteUrl()}/akemi`,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.brand.title,
      description: descriptionMap[locale],
    },
  };
}

type SectionRenderer = {
  render: (section: HomepageSection) => ReactNode;
};

// Home page for the tattoo portfolio, built to the brutalist spec.
export default async function Home() {
  const locale = await getRequestLocale();
  const dictionary = getPublicDictionary(locale);
  const akemiTenant = await getArtistTenantBySlug("akemion-tattoo");
  const ownerUserId = akemiTenant?.owner_user_id ?? null;
  const tattoos = await getTattooGallery(ownerUserId ?? undefined);
  const posts = await getPublishedPosts(ownerUserId ?? undefined);
  const galleries = await getGalleries(ownerUserId ?? undefined);
  const homepageSections = await getHomepageSections(locale, ownerUserId ?? undefined);

  const renderers = new Map<string, SectionRenderer>([
    [
      "hero",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <section className="hard-border bg-[var(--bg)] px-6 py-10 md:px-10 md:py-14">
              {section.eyebrow ? (
                <p className="mb-4 text-xs uppercase tracking-[0.5em]">
                  {section.eyebrow}
                </p>
              ) : null}
              <h2 className="mb-6 font-[var(--font-heading)] text-4xl uppercase md:text-5xl">
                {section.title}
              </h2>
              <p className="max-w-2xl text-sm md:text-base">
                {dictionary.hero.body}
              </p>
            </section>
          </Reveal>
        ),
      },
    ],
    [
      "work",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              <GalleryFilter
                tattoos={tattoos}
                galleries={galleries}
                filterLabel={dictionary.work.filter}
                allLabel={dictionary.work.all}
              />
            </Section>
          </Reveal>
        ),
      },
    ],
    [
      "galleries",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              {galleries.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {galleries.map((gallery) => (
                    <a
                      key={gallery.id}
                      className="hard-border p-4 theme-hover-invert"
                      href={`/galleries/${gallery.slug}`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em]">
                        {gallery.slug}
                      </p>
                      <h3 className="mt-2 text-lg uppercase">{gallery.title}</h3>
                      {gallery.description ? (
                        <p className="text-sm">{gallery.description}</p>
                      ) : null}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm uppercase tracking-[0.2em]">
                  {dictionary.galleries.empty}
                </p>
              )}
            </Section>
          </Reveal>
        ),
      },
    ],
    [
      "about",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              <p>{dictionary.about.body1}</p>
              <p>{dictionary.about.body2}</p>
            </Section>
          </Reveal>
        ),
      },
    ],
    [
      "booking",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              <p className="text-sm uppercase tracking-[0.2em]">
                {dictionary.booking.intro}
              </p>
              <BookingForm copy={dictionary.booking} />
            </Section>
          </Reveal>
        ),
      },
    ],
    [
      "rates",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              <PriceCards cards={dictionary.rates.cards} />
              <p className="text-sm uppercase tracking-[0.2em]">
                {dictionary.rates.depositNote}
              </p>
              <PaymentButtons copy={dictionary.rates} />
            </Section>
          </Reveal>
        ),
      },
    ],
    [
      "contact",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              <ContactForm copy={dictionary.contact} />
            </Section>
          </Reveal>
        ),
      },
    ],
    [
      "posts",
      {
        render: (section) => (
          <Reveal key={section.section_key}>
            <Section
              id={section.section_key}
              title={section.title}
              eyebrow={section.eyebrow ?? undefined}
            >
              {posts.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {posts.map((post) => (
                    <article key={post.id} className="hard-border p-4">
                      {post.cover_image_url ? (
                        <Image
                          className="mb-3 w-full object-cover"
                          src={post.cover_image_url}
                          alt={post.title}
                          width={1200}
                          height={800}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : null}
                      <h3 className="text-lg uppercase">{post.title}</h3>
                      <p className="text-sm">{post.excerpt || post.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm uppercase tracking-[0.2em]">
                  {dictionary.posts.empty}
                </p>
              )}
            </Section>
          </Reveal>
        ),
      },
    ],
  ]);

  const visibleSections = homepageSections.filter((section) => section.is_visible);
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dictionary.brand.title,
    alternateName: "Akemi Tattoo",
    url: `${siteUrl}/akemi`,
    inLanguage: locale,
    description:
      "Tattoo portfolio, booking portal, and studio notes for Akemi.",
    publisher: {
      "@type": "Person",
      name: "Akemi",
      jobTitle: "Tattoo Artist",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Berlin",
        addressCountry: "DE",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--fg)] md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NoiseOverlay />
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          sections={visibleSections}
          locale={locale}
          brandEyebrow={dictionary.brand.eyebrow}
          brandTitle={dictionary.brand.title}
        />

        {visibleSections.map((section) =>
          renderers.get(section.section_key)?.render(section)
        )}

        <Footer
          studioLabel={dictionary.footer.studio}
          copyrightLabel={dictionary.footer.copyright}
        />
      </div>
    </div>
  );
}
