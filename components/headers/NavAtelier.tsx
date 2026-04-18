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

export function NavAtelier({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
  return (
    <header className="hard-border bg-[var(--bg)] px-8 py-10 md:px-12">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.6em] opacity-50 mb-1">{brandEyebrow}</p>
          <h1 className="font-[var(--font-heading)] text-4xl md:text-6xl leading-none">{brandTitle}</h1>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
          <nav className="flex flex-wrap gap-3">
            {navItems.map((s) => (
              <a
                key={s.section_key}
                href={`#${s.section_key}`}
                className="text-[10px] uppercase tracking-[0.4em] px-3 py-1.5 theme-border snap-transition theme-hover-invert"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
