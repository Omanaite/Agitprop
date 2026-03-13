import { BookingForm } from "@/components/BookingForm";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Header } from "@/components/Header";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { PaymentButtons } from "@/components/PaymentButtons";
import { PriceCards } from "@/components/PriceCards";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getGalleries } from "@/lib/data/galleries";
import { getPublishedPosts } from "@/lib/data/posts";
import { getTattooGallery } from "@/lib/data/tattoos";

// Home page for the tattoo portfolio, built to the brutalist spec.
export default async function Home() {
  const tattoos = await getTattooGallery();
  const posts = await getPublishedPosts();
  const galleries = await getGalleries();

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--fg)] md:p-8">
      <NoiseOverlay />
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header />

        <Reveal>
          <section className="hard-border bg-[var(--bg)] px-6 py-10 md:px-10 md:py-14">
            <p className="mb-4 text-xs uppercase tracking-[0.5em]">
              Brutalist Digital Zine
            </p>
            <h2 className="mb-6 font-[var(--font-heading)] text-4xl uppercase md:text-5xl">
              Anatomy, Anarchy, Ink.
            </h2>
            <p className="max-w-2xl text-sm md:text-base">
              Akemi is a Berlin-based tattoo artist working at the intersection
              of ignorant linework, fine-line precision, and surreal anatomy.
              This portfolio is a living archive of pieces, flash fragments,
              and booking rituals.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <Section id="work" title="Selected Work" eyebrow="Gallery">
            <GalleryGrid tattoos={tattoos} />
          </Section>
        </Reveal>

        <Reveal>
          <Section id="galleries" title="Curated Galleries" eyebrow="Collections">
            {galleries.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="hard-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em]">
                      {gallery.slug}
                    </p>
                    <h3 className="mt-2 text-lg uppercase">{gallery.title}</h3>
                    {gallery.description ? (
                      <p className="text-sm">{gallery.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm uppercase tracking-[0.2em]">
                No galleries published yet.
              </p>
            )}
          </Section>
        </Reveal>

        <Reveal>
          <Section id="about" title="Artist Statement" eyebrow="About">
            <p>
              Each line is a refusal of ornament. The body is a canvas, the ink
              is evidence. Expect high-contrast blackwork, raw texture, and
              anatomical distortions that feel like found objects from a
              terminal-era zine.
            </p>
            <p>
              Studio policy: only custom projects, no replicas. Respect the
              ritual; respect the aftercare.
            </p>
          </Section>
        </Reveal>

        <Reveal>
          <Section id="booking" title="Booking Protocol" eyebrow="Session">
            <p className="text-sm uppercase tracking-[0.2em]">
              Slots open monthly. Use the form below. Replies within 48 hours.
            </p>
            <BookingForm />
          </Section>
        </Reveal>

        <Reveal>
          <Section id="rates" title="Rates & Payments" eyebrow="Pricing">
            <PriceCards />
            <p className="text-sm uppercase tracking-[0.2em]">
              Deposits are required to confirm a session.
            </p>
            <PaymentButtons />
          </Section>
        </Reveal>

        <Reveal>
          <Section id="contact" title="Direct Contact" eyebrow="Signal">
            <ContactForm />
          </Section>
        </Reveal>

        <Reveal>
          <Section id="posts" title="Studio Notes" eyebrow="Posts">
            {posts.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                  <article key={post.id} className="hard-border p-4">
                    {post.cover_image_url ? (
                      <img
                        className="mb-3 w-full object-cover"
                        src={post.cover_image_url}
                        alt={post.title}
                      />
                    ) : null}
                    <h3 className="text-lg uppercase">{post.title}</h3>
                    <p className="text-sm">
                      {post.excerpt || post.body}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm uppercase tracking-[0.2em]">
                No public posts yet.
              </p>
            )}
          </Section>
        </Reveal>

        <Footer />
      </div>
    </div>
  );
}
