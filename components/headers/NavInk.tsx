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
      <header className="bg-[var(--bg)] px-6 md:px-10 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.9em] opacity-30 mb-1">{brandEyebrow}</p>
            <h1
              className="text-xl md:text-3xl uppercase tracking-[0.25em] font-light"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            >
              {brandTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="text-[10px] uppercase tracking-[0.5em] px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-all duration-300"
            >
              Menu
            </button>
          </div>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/40 to-transparent" />
      </header>

      {/* Fullscreen overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "var(--fg)", color: "var(--bg)" }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="sticky top-0 self-end mr-8 mt-8 text-[10px] uppercase tracking-[0.6em] opacity-40 hover:opacity-100 transition-opacity duration-200 z-10"
          aria-label="Close"
        >
          ✕ Close
        </button>

        <div className="flex flex-col items-center justify-center flex-1 py-10 px-6">
        <p className="text-[9px] uppercase tracking-[1.2em] mb-10 opacity-20">
          {brandEyebrow}
        </p>

        <nav className="flex flex-col items-center w-full max-w-lg">
          {navItems.map((s, i) => (
            <a
              key={s.section_key}
              href={`#${s.section_key}`}
              onClick={() => setOpen(false)}
              className="group relative w-full text-center py-4 overflow-hidden"
            >
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-mono opacity-20">
                0{i + 1}
              </span>
              <span
                className="text-4xl md:text-6xl uppercase tracking-[0.08em] font-extralight opacity-80 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-300"
                style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
              >
                {s.title}
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-2/3" />
            </a>
          ))}
        </nav>
        </div>
      </div>
    </>
  );
}
