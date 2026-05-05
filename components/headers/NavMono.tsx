"use client";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* Mouse-tracking 3D tilt on hero title */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = titleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * -6;
      const ry = ((e.clientX - cx) / rect.width) * 8;
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (titleRef.current) {
      titleRef.current.style.transition = "transform 600ms cubic-bezier(0.16,1,0.3,1)";
      titleRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
      setTimeout(() => {
        if (titleRef.current) titleRef.current.style.transition = "";
      }, 600);
    }
  }, []);

  useEffect(() => {
    const header = titleRef.current?.closest("header");
    if (!header) return;
    header.addEventListener("mousemove", handleMouseMove);
    header.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      header.removeEventListener("mousemove", handleMouseMove);
      header.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <>
      <header className="bg-[var(--bg)]" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-center justify-between px-6 md:px-10 py-3 border-b border-[var(--fg)]/10">
          <p className="text-[9px] uppercase tracking-[0.6em] opacity-40 font-mono">{brandEyebrow}</p>
          <div className="flex items-center gap-4">
            <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
            {/* 3×3 dot grid — morphs: open → dots scatter to corners */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid grid-cols-3 gap-[4px] w-8 h-8 items-center justify-items-center p-1"
              style={{ opacity: 0.55, transition: "opacity 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
            >
              {Array.from({ length: 9 }).map((_, i) => {
                const row = Math.floor(i / 3);
                const col = i % 3;
                const tx = open ? (col - 1) * 3 : 0;
                const ty = open ? (row - 1) * 3 : 0;
                return (
                  <span
                    key={i}
                    className="block rounded-full bg-[var(--fg)]"
                    style={{
                      width: "3px",
                      height: "3px",
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: `transform 300ms cubic-bezier(0.16,1,0.3,1) ${i * 18}ms`,
                    }}
                  />
                );
              })}
            </button>
          </div>
        </div>

        {/* Hero title with 3D tilt */}
        <div className="px-6 md:px-10 pt-6 pb-8 overflow-hidden" style={{ perspective: "600px" }}>
          <h1
            ref={titleRef}
            className="text-[clamp(3rem,14vw,9rem)] leading-[0.88] font-black uppercase tracking-[-0.04em] select-none cursor-default"
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {brandTitle}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 h-[2px] bg-[var(--fg)]" />
            <span className="text-[9px] uppercase tracking-[0.6em] opacity-40 shrink-0 font-mono">
              {navItems.length} sections
            </span>
          </div>
        </div>
      </header>

      {/* Full-screen terminal grid overlay */}
      {(open || mounted) && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            background: "var(--fg)",
            color: "var(--bg)",
            opacity: open ? 1 : 0,
            transition: "opacity 300ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[var(--bg)]/10">
            <span className="text-[9px] uppercase tracking-[0.6em] opacity-30 font-mono">
              {brandEyebrow} / INDEX
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid grid-cols-3 gap-[4px] w-8 h-8 items-center justify-items-center p-1"
              style={{ opacity: 0.4, transition: "opacity 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="block rounded-full bg-[var(--bg)]" style={{ width: "3px", height: "3px" }} />
              ))}
            </button>
          </div>

          {/* Grid — items reveal top→bottom with clip-path */}
          <nav
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4 md:p-10 gap-px"
          >
            {navItems.map((s, i) => (
              <a
                key={s.section_key}
                href={`#${s.section_key}`}
                onClick={() => setOpen(false)}
                className="group flex flex-col justify-between p-5 md:p-8 border border-[var(--bg)]/10 hover:bg-[var(--bg)]/5 transition-colors duration-150"
                style={{
                  clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                  transition: `clip-path 500ms cubic-bezier(0.16,1,0.3,1) ${i * 55 + 80}ms`,
                }}
              >
                <span className="text-[9px] font-mono opacity-25 tracking-[0.4em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-xl md:text-2xl font-black uppercase tracking-[-0.02em] mt-8 group-hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
                >
                  {s.title}
                </span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
