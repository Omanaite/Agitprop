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

export function NavAtelier({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 700);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <>
      <header className="relative bg-[var(--bg)] pt-8 pb-0">
        <div className="flex items-center justify-between px-8 md:px-12 mb-8">
          <p
            className="text-[9px] uppercase tracking-[0.7em] opacity-40"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {brandEyebrow}
          </p>
          <div className="flex items-center gap-5">
            <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />

            {/* Morphing hamburger — lines rotate to X */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative flex flex-col gap-[7px] w-8 h-8 items-center justify-center"
              style={{ transform: "scale(1)", transition: "transform 120ms ease" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span
                className="block h-px bg-[var(--fg)] absolute"
                style={{
                  width: "26px",
                  transform: open ? "rotate(45deg)" : "translateY(-5px)",
                  transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              <span
                className="block h-px bg-[var(--fg)] absolute"
                style={{
                  width: open ? "26px" : "16px",
                  opacity: open ? 0 : 1,
                  transform: open ? "translateX(8px)" : "translateX(5px)",
                  transition: "opacity 200ms ease, width 300ms ease, transform 300ms ease",
                }}
              />
              <span
                className="block h-px bg-[var(--fg)] absolute"
                style={{
                  width: "26px",
                  transform: open ? "rotate(-45deg)" : "translateY(5px)",
                  transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Large centered title — each word clips up on load */}
        <div className="text-center px-8 md:px-12 overflow-hidden">
          <h1
            className="text-5xl md:text-7xl leading-[0.9] tracking-[-0.02em]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {brandTitle}
          </h1>
        </div>

        <div className="mt-8 px-8 md:px-12">
          <div className="h-px bg-[var(--fg)] opacity-20" />
        </div>
      </header>

      {/* Fullscreen editorial split overlay */}
      {(open || mounted) && (
        <div className="fixed inset-0 z-50 flex" aria-modal="true">
          {/* Left panel — clips in from left */}
          <div
            className="hidden md:flex flex-col justify-end p-12 w-1/2 overflow-hidden"
            style={{
              background: "var(--fg)",
              color: "var(--bg)",
              clipPath: open ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 600ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <p
              className="text-[9px] uppercase tracking-[0.7em] opacity-30 mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {brandEyebrow}
            </p>
            {/* Title clips up from bottom */}
            <div style={{ overflow: "hidden" }}>
              <h2
                className="text-[clamp(3rem,8vw,6rem)] leading-[0.88] tracking-[-0.03em]"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  transform: open ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 700ms cubic-bezier(0.16,1,0.3,1) 200ms",
                }}
              >
                {brandTitle}
              </h2>
            </div>
          </div>

          {/* Right panel — clips in from right */}
          <div
            className="flex-1 flex flex-col justify-between p-8 md:p-12"
            style={{
              background: "var(--bg)",
              clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
              transition: "clip-path 600ms cubic-bezier(0.16,1,0.3,1) 80ms",
            }}
          >
            <div className="flex justify-end">
              {/* Morph close in overlay too */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="relative w-7 h-7 flex items-center justify-center"
                style={{ opacity: 0.5, transition: "opacity 150ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                <span
                  className="block h-px bg-[var(--fg)] absolute w-5"
                  style={{ transform: "rotate(45deg)" }}
                />
                <span
                  className="block h-px bg-[var(--fg)] absolute w-5"
                  style={{ transform: "rotate(-45deg)" }}
                />
              </button>
            </div>

            {/* Nav items — clip-path wipe left→right per item */}
            <nav className="flex flex-col gap-0 mt-auto">
              {navItems.map((s, i) => (
                <a
                  key={s.section_key}
                  href={`#${s.section_key}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-6 py-5 border-b border-[var(--fg)]/10 overflow-hidden"
                >
                  <span
                    className="text-[9px] uppercase tracking-[0.5em] opacity-25 shrink-0"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-2xl md:text-3xl tracking-[-0.01em]"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      clipPath: open ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                      transition: `clip-path 550ms cubic-bezier(0.16,1,0.3,1) ${i * 70 + 250}ms`,
                    }}
                  >
                    {s.title}
                  </span>
                  {/* Hover line grows right */}
                  <span
                    className="ml-auto block h-px bg-[var(--fg)] opacity-0 group-hover:opacity-25"
                    style={{
                      width: "0px",
                      transition: "width 350ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease",
                    }}
                    ref={(el) => {
                      if (!el) return;
                      const p = el.parentElement!;
                      const show = () => { el.style.width = "40px"; el.style.opacity = "0.25"; };
                      const hide = () => { el.style.width = "0px"; el.style.opacity = "0"; };
                      p.addEventListener("mouseenter", show);
                      p.addEventListener("mouseleave", hide);
                    }}
                  />
                </a>
              ))}
            </nav>
            <div className="h-8" />
          </div>
        </div>
      )}
    </>
  );
}
