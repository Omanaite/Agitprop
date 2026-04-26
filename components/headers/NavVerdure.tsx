"use client";
import { SitePreferencesMenu } from "@/components/SitePreferencesMenu";
import type { Locale } from "@/lib/i18n";
import type { HomepageSection } from "@/types";

type Props = {
  navItems: HomepageSection[];
  locale: Locale;
  brandEyebrow: string;
  brandTitle: string;
  siteTheme: string;
};

export function NavVerdure({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
  return (
    <header className="bg-[var(--bg)] px-6 md:px-10 pt-8 pb-6">
      <div className="flex justify-end mb-6">
        <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
      </div>

      {/* Botanical ornament + centered title */}
      <div className="text-center mb-6">
        <p
          className="text-[9px] uppercase tracking-[0.8em] opacity-35 mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {brandEyebrow}
        </p>
        <h1
          className="text-3xl md:text-6xl leading-tight font-normal italic"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {brandTitle}
        </h1>

        {/* Organic divider */}
        <div className="flex items-center justify-center gap-3 mt-5 opacity-40">
          <span className="block h-px flex-1 max-w-[60px] bg-[var(--accent)]" />
          <span className="text-[var(--accent)] text-base">❧</span>
          <span className="block h-px flex-1 max-w-[60px] bg-[var(--accent)]" />
        </div>
      </div>

      {/* Pill nav */}
      <nav className="flex flex-wrap justify-center gap-2 mt-4">
        {navItems.map((s) => (
          <a
            key={s.section_key}
            href={`#${s.section_key}`}
            className="text-[10px] uppercase tracking-[0.4em] px-5 py-2 rounded-full border border-[var(--accent)]/30 text-[var(--fg)] opacity-70 hover:opacity-100 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-all duration-300"
          >
            {s.title}
          </a>
        ))}
      </nav>
    </header>
  );
}
