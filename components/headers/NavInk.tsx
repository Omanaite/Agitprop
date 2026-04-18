"use client";
import { useState } from "react";
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

export function NavInk({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-[var(--bg)] px-6 py-6 md:px-10 flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="text-[9px] uppercase tracking-[0.8em] opacity-30 mb-1">{brandEyebrow}</p>
          <h1 className="font-[var(--font-heading)] text-lg md:text-2xl uppercase tracking-[0.3em]">
            {brandTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3 absolute right-6 md:right-10">
          <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[10px] uppercase tracking-[0.4em] px-3 py-1.5 border border-[var(--fg)] snap-transition hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--fg)] text-[var(--bg)] flex flex-col items-center justify-center gap-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-6 right-8 text-[10px] uppercase tracking-[0.5em] opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            Close ✕
          </button>
          <p className="text-[9px] uppercase tracking-[1em] opacity-30 mb-10">{brandEyebrow}</p>
          {navItems.map((s) => (
            <a
              key={s.section_key}
              href={`#${s.section_key}`}
              onClick={() => setOpen(false)}
              className="text-4xl md:text-6xl font-[var(--font-heading)] uppercase tracking-[0.1em] py-3 opacity-80 hover:opacity-100 transition-opacity border-b border-current/10 w-full text-center"
            >
              {s.title}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
