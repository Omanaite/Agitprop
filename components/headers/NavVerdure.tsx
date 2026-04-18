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
    <header className="bg-[var(--bg)] px-6 py-10 md:px-10 text-center">
      <div className="flex justify-end mb-4">
        <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
      </div>
      <p className="text-[10px] uppercase tracking-[0.7em] opacity-40 mb-3">{brandEyebrow}</p>
      <h1 className="font-[var(--font-heading)] text-3xl md:text-5xl mb-8 leading-tight">
        {brandTitle}
      </h1>
      {/* Organic divider */}
      <div className="flex items-center justify-center gap-3 mb-6 opacity-30">
        <span className="block h-px flex-1 max-w-[80px] bg-[var(--fg)]" />
        <span className="text-xs">✦</span>
        <span className="block h-px flex-1 max-w-[80px] bg-[var(--fg)]" />
      </div>
      <nav className="flex flex-wrap justify-center gap-2">
        {navItems.map((s) => (
          <a
            key={s.section_key}
            href={`#${s.section_key}`}
            className="text-[10px] uppercase tracking-[0.4em] px-4 py-2 rounded-full border border-[var(--fg)]/30 snap-transition hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            {s.title}
          </a>
        ))}
      </nav>
    </header>
  );
}
