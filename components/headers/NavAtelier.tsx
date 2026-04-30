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
    <header className="relative bg-[var(--bg)] pt-8 pb-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 md:px-12 mb-8">
        <p
          className="text-[9px] uppercase tracking-[0.7em] opacity-40"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {brandEyebrow}
        </p>
        <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
      </div>

      {/* Large centered title */}
      <div className="text-center px-8 md:px-12">
        <h1
          className="text-5xl md:text-7xl leading-[0.9] tracking-[-0.02em]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {brandTitle}
        </h1>
      </div>

      {/* Rule + Nav */}
      <div className="mt-8 px-8 md:px-12">
        <div className="h-px bg-[var(--fg)] opacity-20" />
        <nav className="flex flex-wrap justify-center gap-8 py-4">
          {navItems.map((s) => (
            <a
              key={s.section_key}
              href={`#${s.section_key}`}
              className="group relative text-[10px] uppercase tracking-[0.5em] opacity-60 hover:opacity-100 transition-opacity duration-300 py-1"
            >
              {s.title}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--fg)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="h-px bg-[var(--fg)] opacity-20" />
      </div>
    </header>
  );
}
