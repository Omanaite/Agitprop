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

export function NavMono({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header bar */}
      <header className="bg-[var(--bg)] px-6 py-6 md:px-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-0.5">{brandEyebrow}</p>
            <h1 className="font-[var(--font-heading)] text-5xl md:text-8xl leading-none font-black uppercase">
              {brandTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-2xl leading-none px-2 py-1 snap-transition hover:opacity-60"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
        {/* Thick rule */}
        <div className="mt-4 h-[3px] bg-[var(--fg)]" />
      </header>

      {/* Side drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          {/* Panel */}
          <div className="w-72 bg-[var(--fg)] text-[var(--bg)] flex flex-col p-8 gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="self-end text-xl mb-6 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-4">Navigation</p>
            {navItems.map((s, i) => (
              <a
                key={s.section_key}
                href={`#${s.section_key}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 text-2xl font-bold uppercase tracking-[0.05em] py-2 border-b border-current/10 hover:opacity-60 transition-opacity"
              >
                <span className="text-xs opacity-30 font-normal">0{i + 1}</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
