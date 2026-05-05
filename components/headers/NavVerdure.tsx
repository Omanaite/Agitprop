"use client";
import { useState, useEffect } from "react";
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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 600);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <>
      {/* Breathing keyframes injected once */}
      <style>{`
        @keyframes verdure-breathe {
          0%, 100% { opacity: 0.35; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.6; transform: scale(1.15) rotate(8deg); }
        }
        @keyframes verdure-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .verdure-ornament { animation: verdure-breathe 4s ease-in-out infinite; }
        .verdure-title { animation: verdure-float 6s ease-in-out infinite; }
      `}</style>

      <header className="bg-[var(--bg)] px-6 md:px-10 pt-8 pb-6">
        <div className="flex justify-between items-center mb-6">
          <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
          {/* Morphing hamburger — rounds + accent middle → X */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex flex-col items-end justify-center w-9 h-9"
            style={{ transform: "scale(1)", transition: "transform 120ms ease" }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.90)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span
              className="block rounded-full bg-[var(--fg)] absolute"
              style={{
                width: "22px",
                height: "1.5px",
                transform: open ? "rotate(45deg) translateY(0)" : "translateY(-5px)",
                transition: "transform 350ms cubic-bezier(0.16,1,0.3,1), background 250ms ease",
              }}
            />
            <span
              className="block rounded-full absolute"
              style={{
                width: open ? "22px" : "14px",
                height: "1.5px",
                background: open ? "var(--fg)" : "var(--accent)",
                opacity: open ? 0 : 1,
                transform: "translateX(-1px)",
                transition: "opacity 200ms ease, width 300ms ease, background 250ms ease",
              }}
            />
            <span
              className="block rounded-full bg-[var(--fg)] absolute"
              style={{
                width: "22px",
                height: "1.5px",
                transform: open ? "rotate(-45deg) translateY(0)" : "translateY(5px)",
                transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </button>
        </div>

        {/* Centered title with breathing ornament */}
        <div className="text-center mb-6">
          <p
            className="text-[9px] uppercase tracking-[0.8em] opacity-35 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {brandEyebrow}
          </p>
          <h1
            className="verdure-title text-3xl md:text-6xl leading-tight font-normal italic"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {brandTitle}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5 opacity-40">
            <span className="block h-px flex-1 max-w-[60px] bg-[var(--accent)]" />
            <span className="verdure-ornament text-[var(--accent)] text-base inline-block">❧</span>
            <span className="block h-px flex-1 max-w-[60px] bg-[var(--accent)]" />
          </div>
        </div>
      </header>

      {/* Botanical bottom-sheet — clip-path organic reveal */}
      {(open || mounted) && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{
              background: "var(--fg)",
              opacity: open ? 0.18 : 0,
              transition: "opacity 450ms ease",
            }}
            onClick={() => setOpen(false)}
          />

          <div
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col"
            style={{
              background: "var(--bg)",
              maxHeight: "85vh",
              clipPath: open
                ? "inset(0% 0% 0% 0% round 0px)"
                : "inset(100% 0% 0% 0% round 0px)",
              transition: open
                ? "clip-path 550ms cubic-bezier(0.16,1,0.3,1)"
                : "clip-path 450ms cubic-bezier(0.7,0,0.84,0)",
              borderTop: "1px solid var(--accent)",
            }}
          >
            {/* Handle */}
            <div className="flex items-center justify-between px-8 pt-6 pb-4">
              <div className="flex items-center gap-3 opacity-35">
                <span className="block h-px w-10 bg-[var(--accent)]" />
                <span
                  className="text-[var(--accent)] text-sm inline-block"
                  style={{
                    animation: open ? "verdure-breathe 4s ease-in-out infinite" : "none",
                  }}
                >
                  ❧
                </span>
                <span className="block h-px w-10 bg-[var(--accent)]" />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-[9px] uppercase tracking-[0.5em] opacity-35 hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Close
              </button>
            </div>

            {/* Nav items — clip-path bottom→top per item */}
            <nav className="flex flex-col px-8 pb-10 overflow-y-auto gap-0">
              {navItems.map((s, i) => (
                <a
                  key={s.section_key}
                  href={`#${s.section_key}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-4 py-4 border-b border-[var(--accent)]/15 overflow-hidden"
                >
                  <span
                    className="text-[var(--accent)] text-xs opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                      transition: `clip-path 450ms cubic-bezier(0.16,1,0.3,1) ${i * 50 + 150}ms`,
                    }}
                  >
                    ❧
                  </span>
                  <span
                    className="text-xl md:text-2xl italic font-normal group-hover:opacity-40 transition-opacity duration-200"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                      transition: `clip-path 450ms cubic-bezier(0.16,1,0.3,1) ${i * 50 + 180}ms`,
                    }}
                  >
                    {s.title}
                  </span>
                  <span
                    className="ml-auto text-[9px] uppercase tracking-[0.5em] opacity-15 group-hover:opacity-40 transition-opacity"
                    style={{
                      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                      transition: `clip-path 450ms cubic-bezier(0.16,1,0.3,1) ${i * 50 + 210}ms`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
