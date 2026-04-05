import type { Locale } from "@/lib/i18n";
import type { HomepageSection } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

const DEFAULT_HOMEPAGE_SECTION_COPY: Record<
  Locale,
  Array<{ section_key: string; title: string; eyebrow: string; sort_order: number }>
> = {
  en: [
    { section_key: "hero", title: "Anatomy, Anarchy, Ink.", eyebrow: "Brutalist Digital Zine", sort_order: 0 },
    { section_key: "work", title: "Selected Work", eyebrow: "Gallery", sort_order: 1 },
    { section_key: "galleries", title: "Curated Galleries", eyebrow: "Collections", sort_order: 2 },
    { section_key: "about", title: "Artist Statement", eyebrow: "About", sort_order: 3 },
    { section_key: "booking", title: "Booking Protocol", eyebrow: "Session", sort_order: 4 },
    { section_key: "rates", title: "Rates & Payments", eyebrow: "Pricing", sort_order: 5 },
    { section_key: "contact", title: "Direct Contact", eyebrow: "Signal", sort_order: 6 },
    { section_key: "posts", title: "Studio Notes", eyebrow: "Posts", sort_order: 7 },
  ],
  es: [
    { section_key: "hero", title: "Anatomia, anarquia, tinta.", eyebrow: "Zine digital brutalista", sort_order: 0 },
    { section_key: "work", title: "Trabajo seleccionado", eyebrow: "Galeria", sort_order: 1 },
    { section_key: "galleries", title: "Galerias curadas", eyebrow: "Colecciones", sort_order: 2 },
    { section_key: "about", title: "Declaracion de artista", eyebrow: "Sobre la artista", sort_order: 3 },
    { section_key: "booking", title: "Protocolo de reserva", eyebrow: "Sesion", sort_order: 4 },
    { section_key: "rates", title: "Tarifas y pagos", eyebrow: "Precios", sort_order: 5 },
    { section_key: "contact", title: "Contacto directo", eyebrow: "Canal", sort_order: 6 },
    { section_key: "posts", title: "Notas del estudio", eyebrow: "Publicaciones", sort_order: 7 },
  ],
  de: [
    { section_key: "hero", title: "Anatomie, Anarchie, Tinte.", eyebrow: "Brutalistisches Digital-Zine", sort_order: 0 },
    { section_key: "work", title: "Ausgewaehlte Arbeiten", eyebrow: "Galerie", sort_order: 1 },
    { section_key: "galleries", title: "Kurierte Galerien", eyebrow: "Kollektionen", sort_order: 2 },
    { section_key: "about", title: "Kuenstlerisches Statement", eyebrow: "Ueber die Kuenstlerin", sort_order: 3 },
    { section_key: "booking", title: "Booking-Protokoll", eyebrow: "Session", sort_order: 4 },
    { section_key: "rates", title: "Preise und Zahlungen", eyebrow: "Preise", sort_order: 5 },
    { section_key: "contact", title: "Direkter Kontakt", eyebrow: "Signal", sort_order: 6 },
    { section_key: "posts", title: "Studio-Notizen", eyebrow: "Beitraege", sort_order: 7 },
  ],
};

export function getDefaultHomepageSections(locale: Locale): HomepageSection[] {
  return DEFAULT_HOMEPAGE_SECTION_COPY[locale].map((section) => ({
    ...section,
    is_visible: true,
  }));
}

export function mergeSections(
  sections: HomepageSection[] | null | undefined,
  locale: Locale = "en"
): HomepageSection[] {
  const englishFallback = getDefaultHomepageSections("en");
  const localizedFallback = getDefaultHomepageSections(locale);
  const map = new Map(
    (sections ?? []).map((section) => [section.section_key, section])
  );

  return localizedFallback
    .map((fallback) => {
      const english = englishFallback.find(
        (item) => item.section_key === fallback.section_key
      );
      const configured = map.get(fallback.section_key);

      if (!configured) {
        return fallback;
      }

      return {
        ...fallback,
        ...configured,
        title:
          configured.title === english?.title ? fallback.title : configured.title,
        eyebrow:
          configured.eyebrow === english?.eyebrow || !configured.eyebrow
            ? fallback.eyebrow
            : configured.eyebrow,
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getHomepageSections(
  locale: Locale = "en",
  ownerUserId?: string | null
): Promise<HomepageSection[]> {
  try {
    const client = createSupabasePublicClient();
    let query = client
      .from("homepage_sections")
      .select(
        "id,section_key,title,eyebrow,body,sort_order,is_visible,created_at,updated_at"
      )
      .order("sort_order", { ascending: true });
    if (ownerUserId) {
      query = query.eq("owner_user_id", ownerUserId);
    }
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return mergeSections((data ?? []) as HomepageSection[], locale);
  } catch {
    return mergeSections([], locale);
  }
}
