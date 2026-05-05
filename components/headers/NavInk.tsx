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

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useScramble(original: string) {
  const [display, setDisplay] = useState(original);
  const rafRef = useRef<number>(0);
  const stepRef = useRef(0);

  const scramble = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stepRef.current = 0;
    const totalSteps = original.length + 4;

    function step() {
      stepRef.current += 1;
      const progress = stepRef.current / totalSteps;
      const resolved = Math.floor(progress * original.length);
      const scrambled = original
        .split("")
        .map((ch, i) => {
          if (i < resolved) return ch;
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setDisplay(scrambled);
      if (stepRef.current < totalSteps) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(original);
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }, [original]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setDisplay(original);
  }, [original]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  return { display, scramble, reset };
}

function ScrambleItem({
  title,
  href,
  index,
  open,
  onClick,
}: {
  title: string;
  href: string;
  index: number;
  open: boolean;
  onClick: () => void;
}) {
  const { display, scramble, reset } = useScramble(title.toUpperCase());

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className="group relative w-full max-w-xl text-center py-5 block"
      style={{
        clipPath: open ? "inset(0 0 0% 0)" : "inset(100% 0 0% 0)",
        transition: `clip-path 600ms cubic-bezier(0.16,1,0.3,1) ${index * 70 + 150}ms`,
      }}
    >
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-mono opacity-20 tracking-[0.4em]">
        0{index + 1}
      </span>
      <span
        className="text-[clamp(2rem,7vw,5rem)] uppercase tracking-[0.06em] font-extralight group-hover:text-[var(--accent)] transition-colors duration-200"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "0.06em" }}
      >
        {display}
      </span>
    </a>
  );
}

export function NavInk({ navItems, locale, brandEyebrow, brandTitle, siteTheme }: Props) {
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
      <header className="bg-[var(--bg)] px-6 md:px-10 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.9em] opacity-30 mb-1">{brandEyebrow}</p>
            <h1
              className="text-3xl md:text-5xl uppercase tracking-[0.25em] font-light"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            >
              {brandTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <SitePreferencesMenu locale={locale} siteTheme={siteTheme} />
            {/* Ink: bordered square with SVG lines that morph */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="w-9 h-9 flex items-center justify-center border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
              style={{
                transition: "background 200ms ease, color 200ms ease",
                transform: "scale(1)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {open ? (
                  <>
                    <line x1="2" y1="2" x2="12" y2="12" style={{ transition: "all 250ms cubic-bezier(0.16,1,0.3,1)" }} />
                    <line x1="12" y1="2" x2="2" y2="12" style={{ transition: "all 250ms cubic-bezier(0.16,1,0.3,1)" }} />
                  </>
                ) : (
                  <>
                    <line x1="1" y1="4" x2="13" y2="4" style={{ transition: "all 250ms cubic-bezier(0.16,1,0.3,1)" }} />
                    <line x1="1" y1="10" x2="8" y2="10" style={{ transition: "all 250ms cubic-bezier(0.16,1,0.3,1)" }} />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/40 to-transparent" />
      </header>

      {/* Fullscreen overlay — iris clip-path expand */}
      {(open || mounted) && (
        <div
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
          style={{
            background: "var(--fg)",
            color: "var(--bg)",
            clipPath: open
              ? "inset(0% 0% 0% 0%)"
              : "inset(50% 50% 50% 50%)",
            transition: open
              ? "clip-path 550ms cubic-bezier(0.16,1,0.3,1)"
              : "clip-path 450ms cubic-bezier(0.7,0,0.84,0)",
          }}
        >
          <div className="flex justify-between items-center px-8 md:px-14 pt-8 shrink-0">
            <p className="text-[10px] uppercase tracking-[0.7em] opacity-20">{brandEyebrow}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="w-9 h-9 flex items-center justify-center border border-[var(--bg)]/20 hover:border-[var(--bg)]/60 transition-colors duration-200"
              style={{ transform: "scale(1)", transition: "transform 120ms ease, border-color 200ms ease" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="1" y1="1" x2="11" y2="11" />
                <line x1="11" y1="1" x2="1" y2="11" />
              </svg>
            </button>
          </div>

          {/* Nav — clip-path bottom wipe + text scramble on hover */}
          <nav className="flex flex-col items-center justify-center flex-1 px-6 py-12">
            {navItems.map((s, i) => (
              <ScrambleItem
                key={s.section_key}
                title={s.title}
                href={`#${s.section_key}`}
                index={i}
                open={open}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
