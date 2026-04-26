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

export function NavAmber({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
  return (
    <>
      <header className="bg-[var(--bg)] px-6 md:px-10 pt-6 pb-0">
        <div className="flex justify-end mb-4">
          <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
        </div>

        {/* Ornamental centered title */}
        <div className="text-center pb-6 border-b-2 border-[var(--fg)]/20">
          <p
            className="text-[9px] uppercase tracking-[0.7em] opacity-35 mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {brandEyebrow}
          </p>

          {/* Decorative rule */}
          <div className="flex items-center justify-center gap-3 mb-3 opacity-40">
            <span className="text-[var(--accent)] text-xs">◆ ◆ ◆</span>
          </div>

          <h1
            className="text-4xl md:text-7xl leading-none tracking-[0.04em]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {brandTitle}
          </h1>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="h-px flex-1 max-w-[80px] bg-[var(--fg)] opacity-20 block" />
            <span className="text-[8px] uppercase tracking-[0.5em] opacity-30">Est. Studio</span>
            <span className="h-px flex-1 max-w-[80px] bg-[var(--fg)] opacity-20 block" />
          </div>
        </div>
      </header>

      {/* Sticky bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)] border-t-2 border-[var(--fg)]/20 flex justify-center flex-wrap gap-0">
        {navItems.map((s) => (
          <a
            key={s.section_key}
            href={`#${s.section_key}`}
            className="text-[9px] uppercase tracking-[0.4em] px-4 py-3 opacity-60 hover:opacity-100 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-all duration-200 border-r border-[var(--fg)]/10 last:border-r-0"
          >
            {s.title}
          </a>
        ))}
      </nav>
      <div className="h-12" aria-hidden="true" />
    </>
  );
}
