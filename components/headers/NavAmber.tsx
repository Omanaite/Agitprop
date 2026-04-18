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
      {/* Top: decorative centered title */}
      <header className="bg-[var(--bg)] px-6 py-8 md:px-10 text-center border-b border-[var(--fg)]/20">
        <div className="flex justify-end mb-2">
          <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.6em] opacity-40 mb-2">{brandEyebrow}</p>
        {/* Ornamental row */}
        <div className="flex items-center justify-center gap-4 mb-1 opacity-30">
          <span className="text-sm">◆</span>
          <span className="block h-px w-16 bg-[var(--fg)]" />
          <h1 className="font-[var(--font-heading)] text-3xl md:text-5xl tracking-[0.05em]">
            {brandTitle}
          </h1>
          <span className="block h-px w-16 bg-[var(--fg)]" />
          <span className="text-sm">◆</span>
        </div>
      </header>

      {/* Sticky bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)] border-t border-[var(--fg)]/20 flex justify-center gap-1 px-4 py-2 flex-wrap">
        {navItems.map((s) => (
          <a
            key={s.section_key}
            href={`#${s.section_key}`}
            className="text-[10px] uppercase tracking-[0.35em] px-3 py-2 snap-transition hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            {s.title}
          </a>
        ))}
      </nav>
      {/* Bottom spacer so content isn't hidden behind sticky bar */}
      <div className="h-10" aria-hidden="true" />
    </>
  );
}
