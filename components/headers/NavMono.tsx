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
      <header className="bg-[var(--bg)]">
        {/* Top utility bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-3 border-b border-[var(--fg)]/10">
          <p className="text-[9px] uppercase tracking-[0.6em] opacity-40">{brandEyebrow}</p>
          <div className="flex items-center gap-4">
            <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex flex-col justify-center gap-[5px] w-8 h-8 group"
            >
              <span className="block h-[2px] bg-[var(--fg)] transition-all duration-200 group-hover:w-full w-full" />
              <span className="block h-[2px] bg-[var(--fg)] w-2/3 transition-all duration-200 group-hover:w-full" />
              <span className="block h-[2px] bg-[var(--fg)] w-1/3 transition-all duration-200 group-hover:w-full" />
            </button>
          </div>
        </div>

        {/* Hero title */}
        <div className="px-6 md:px-10 pt-6 pb-8 overflow-hidden">
          <h1
            className="text-[clamp(3rem,14vw,9rem)] leading-[0.88] font-black uppercase tracking-[-0.04em] select-none"
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            {brandTitle}
          </h1>
          {/* Bottom rule with count */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 h-[2px] bg-[var(--fg)]" />
            <span className="text-[9px] uppercase tracking-[0.6em] opacity-40 shrink-0">
              {navItems.length} sections
            </span>
          </div>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <button
          type="button"
          className="flex-1 bg-[var(--fg)]/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
        {/* Panel */}
        <div
          className={`w-80 bg-[var(--fg)] text-[var(--bg)] flex flex-col p-8 overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="text-[9px] uppercase tracking-[0.6em] opacity-40">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[var(--bg)] opacity-50 hover:opacity-100 transition-opacity text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-0">
            {navItems.map((s, i) => (
              <a
                key={s.section_key}
                href={`#${s.section_key}`}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-4 border-b border-[var(--bg)]/10 hover:pl-2 transition-all duration-200"
              >
                <span className="text-[10px] font-mono opacity-30 w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl font-black uppercase tracking-[-0.02em] group-hover:opacity-70 transition-opacity">
                  {s.title}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
