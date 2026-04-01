import type { Metadata } from "next";
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

const RESERVED = new Set(["admin", "studio", "api", "register", "agitprop", "akemi", "galleries"]);

function getThemeClass(theme: string) {
  if (theme === "ink") return "artist-theme-ink";
  if (theme === "mono") return "artist-theme-mono";
  if (theme === "akemi_brutalist") return "artist-theme-akemi-brutalist";
  return "artist-theme-atelier";
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
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

export default async function ArtistSitePage({
  params,
}: {
  params: Promise<Params>;
}) {
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

  return (
    <div className={`min-h-screen p-4 md:p-8 ${themeClass}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          sections={sections.filter((item) => item.is_visible)}
          locale={locale}
          brandEyebrow="Artist Site"
          brandTitle={tenant.studio_name}
          themeLabels={dictionary.theme}
          localeLabel={dictionary.locale.label}
        />

        <Section id="work" title="Selected work" eyebrow="Portfolio">
          <GalleryFilter
            tattoos={tattoos}
            galleries={galleries}
            filterLabel={dictionary.work.filter}
            allLabel={dictionary.work.all}
          />
        </Section>

        <Section id="galleries" title="Galleries" eyebrow="Collections">
          <div className="grid gap-4 md:grid-cols-2">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                className="theme-border rounded-xl p-4 hover:opacity-80"
                href={`/galleries/${gallery.slug}`}
              >
                <p className="text-xs uppercase tracking-[0.2em]">{gallery.slug}</p>
                <h3 className="mt-2 text-lg">{gallery.title}</h3>
              </Link>
            ))}
          </div>
        </Section>

        <Section id="posts" title="Posts" eyebrow="Updates">
          {posts.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <article key={post.id} className="theme-border rounded-xl p-4">
                  <h3 className="text-lg">{post.title}</h3>
                  <p className="text-sm opacity-80">{post.excerpt || post.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-70">No posts published yet.</p>
          )}
        </Section>

        <Section id="booking" title="Booking" eyebrow="Session">
          <BookingForm copy={dictionary.booking} />
        </Section>

        <Section id="contact" title="Contact" eyebrow="Signal">
          <ContactForm copy={dictionary.contact} />
        </Section>

        <Footer
          studioLabel={tenant.studio_name}
          copyrightLabel={`© ${new Date().getFullYear()} ${tenant.studio_name}`}
        />
      </div>
    </div>
  );
}
