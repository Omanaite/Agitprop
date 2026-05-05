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

export function NavAmber({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
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
      <header className="bg-[var(--bg)] px-6 md:px-10 pt-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
          {/* Art deco morphing hamburger: thin/thick/thin → X */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex flex-col items-center justify-center w-9 h-9"
            style={{ transform: "scale(1)", transition: "transform 120ms ease" }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.90)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span
              className="block bg-[var(--fg)] absolute"
              style={{
                width: open ? "22px" : "24px",
                height: "1px",
                transform: open ? "rotate(45deg)" : "translateY(-5px)",
                transition: "transform 350ms cubic-bezier(0.16,1,0.3,1), width 300ms ease",
              }}
            />
            <span
              className="block bg-[var(--fg)] absolute"
              style={{
                width: "24px",
                height: open ? "1px" : "3px",
                opacity: open ? 0 : 1,
                transition: "opacity 200ms ease, height 250ms ease",
              }}
            />
            <span
              className="block bg-[var(--fg)] absolute"
              style={{
                width: open ? "22px" : "24px",
                height: "1px",
                transform: open ? "rotate(-45deg)" : "translateY(5px)",
                transition: "transform 350ms cubic-bezier(0.16,1,0.3,1), width 300ms ease",
              }}
            />
          </button>
        </div>

        {/* Ornamental centered title */}
        <div className="text-center pb-6 border-b-2 border-[var(--fg)]/20">
          <p
            className="text-[9px] uppercase tracking-[0.7em] opacity-35 mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {brandEyebrow}
          </p>
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

      {/* Art deco overlay — radial circle expand from center */}
      {(open || mounted) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "var(--bg)",
            clipPath: open ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
            transition: open
              ? "clip-path 600ms cubic-bezier(0.16,1,0.3,1)"
              : "clip-path 500ms cubic-bezier(0.7,0,0.84,0)",
          }}
        >
          {/* Corner ◆ — fly in from corners */}
          {[
            { top: "2rem", left: "2rem", tx: open ? "0" : "-24px", ty: open ? "0" : "-24px" },
            { top: "2rem", right: "2rem", tx: open ? "0" : "24px", ty: open ? "0" : "-24px" },
            { bottom: "2rem", left: "2rem", tx: open ? "0" : "-24px", ty: open ? "0" : "24px" },
            { bottom: "2rem", right: "2rem", tx: open ? "0" : "24px", ty: open ? "0" : "24px" },
          ].map((pos, i) => (
            <span
              key={i}
              className="absolute text-[var(--accent)]"
              style={{
                ...pos,
                fontSize: "18px",
                opacity: open ? 0.25 : 0,
                transform: `translate(${pos.tx}, ${pos.ty})`,
                transition: `opacity 400ms ease ${i * 60 + 200}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${i * 60 + 200}ms`,
              }}
            >
              ◆
            </span>
          ))}

          {/* Horizontal deco lines — extend outward from center */}
          <div
            className="absolute top-[4.5rem] inset-x-0 flex items-center gap-4 px-16 pointer-events-none"
            style={{
              opacity: open ? 0.15 : 0,
              transition: "opacity 400ms ease 300ms",
            }}
          >
            <span
              className="flex-1 bg-[var(--fg)]"
              style={{
                height: "1px",
                transform: open ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "right center",
                transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 250ms",
              }}
            />
            <span className="text-[var(--accent)] text-[8px]">◆</span>
            <span
              className="flex-1 bg-[var(--fg)]"
              style={{
                height: "1px",
                transform: open ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 250ms",
              }}
            />
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[5px]"
            style={{ opacity: 0.35, transition: "opacity 200ms ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.35")}
          >
            <span
              className="block bg-[var(--fg)]"
              style={{ width: "20px", height: "1px", transform: "rotate(45deg) translateY(1px)" }}
            />
            <span
              className="block bg-[var(--fg)]"
              style={{ width: "20px", height: "1px", transform: "rotate(-45deg) translateY(-1px)" }}
            />
          </button>

          {/* Nav — clip-path reveal top→bottom */}
          <div className="flex flex-col items-center w-full max-w-sm px-8">
            <div
              className="flex items-center gap-4 mb-8 w-full"
              style={{
                opacity: open ? 0.25 : 0,
                transform: open ? "scaleX(1)" : "scaleX(0.6)",
                transition: "opacity 400ms ease 150ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 150ms",
              }}
            >
              <span className="flex-1 h-px bg-[var(--fg)]" />
              <span className="text-[var(--accent)] text-xs">◆</span>
              <span className="flex-1 h-px bg-[var(--fg)]" />
            </div>

            <nav className="flex flex-col items-center gap-0 w-full">
              {navItems.map((s, i) => (
                <a
                  key={s.section_key}
                  href={`#${s.section_key}`}
                  onClick={() => setOpen(false)}
                  className="group relative w-full text-center py-4 border-b border-[var(--fg)]/10 overflow-hidden"
                >
                  <span
                    className="text-xl md:text-2xl tracking-[0.06em] font-normal group-hover:opacity-35 transition-opacity duration-200 block"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                      transition: `clip-path 450ms cubic-bezier(0.16,1,0.3,1) ${i * 65 + 280}ms`,
                    }}
                  >
                    {s.title}
                  </span>
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] opacity-0 group-hover:opacity-50 transition-opacity duration-200"
                    style={{ color: "var(--accent)" }}
                  >
                    ◆
                  </span>
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] opacity-0 group-hover:opacity-50 transition-opacity duration-200"
                    style={{ color: "var(--accent)" }}
                  >
                    ◆
                  </span>
                </a>
              ))}
            </nav>

            <div
              className="flex items-center gap-4 mt-8 w-full"
              style={{
                opacity: open ? 0.25 : 0,
                transform: open ? "scaleX(1)" : "scaleX(0.6)",
                transition: "opacity 400ms ease 150ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 150ms",
              }}
            >
              <span className="flex-1 h-px bg-[var(--fg)]" />
              <span className="text-[var(--accent)] text-xs">◆ ◆ ◆</span>
              <span className="flex-1 h-px bg-[var(--fg)]" />
            </div>
          </div>

          {/* Bottom deco lines */}
          <div
            className="absolute bottom-[4.5rem] inset-x-0 flex items-center gap-4 px-16 pointer-events-none"
            style={{
              opacity: open ? 0.15 : 0,
              transition: "opacity 400ms ease 300ms",
            }}
          >
            <span
              className="flex-1 bg-[var(--fg)]"
              style={{
                height: "1px",
                transform: open ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "right center",
                transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 250ms",
              }}
            />
            <span className="text-[var(--accent)] text-[8px]">◆</span>
            <span
              className="flex-1 bg-[var(--fg)]"
              style={{
                height: "1px",
                transform: open ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 250ms",
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom sticky nav — desktop only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)] border-t-2 border-[var(--fg)]/20 hidden md:flex justify-center flex-wrap gap-0">
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
      <div className="h-12 hidden md:block" aria-hidden="true" />
    </>
  );
}
