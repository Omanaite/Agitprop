"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Mode = "light" | "eye" | "dark";

type Props = {
  locale: Locale;
  siteTheme?: string;
};

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "○" },
  { id: "eye",   label: "Eye",   icon: "◎" },
  { id: "dark",  label: "Dark",  icon: "●" },
];

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "de", label: "DE" },
];

// Returns the CSS class for a given artist theme + mode.
// Artist themes have a "_b" dark variant. Eye mode uses html[data-theme="eye"]
// as a tint layer since there are no per-theme eye variants.
function getThemeClass(siteTheme: string, mode: Mode): string {
  const BASE: Record<string, string> = {
    atelier:          "artist-theme-atelier",
    mono:             "artist-theme-mono",
    ink:              "artist-theme-ink",
    verdure:          "artist-theme-verdure",
    amber:            "artist-theme-amber",
    akemi_brutalist:  "artist-theme-akemi-brutalist",
  };
  const base = BASE[siteTheme] ?? BASE["atelier"];
  if (mode === "dark") return `${base}-b`;
  if (mode === "eye")  return base; // eye tint applied via html[data-theme="eye"]
  return base;
}

// Storage key scoped to site theme so each artist's preference is independent.
function storageKey(siteTheme: string) {
  return `theme-mode:${siteTheme}`;
}

export function SitePreferencesMenu({ locale, siteTheme = "atelier" }: Props) {
  const [mode, setMode] = useState<Mode>("light");
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Init from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey(siteTheme)) as Mode | null;
    const initial: Mode = saved ?? "light";
    applyMode(initial, siteTheme);
    setMode(initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteTheme]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function applyMode(m: Mode, theme: string) {
    const root = document.getElementById("theme-root");

    // Swap artist theme class (light ↔ dark variant)
    if (root) {
      const cls = getThemeClass(theme, m);
      // Remove all known artist-theme-* classes then add the correct one
      const existing = Array.from(root.classList).filter((c) => c.startsWith("artist-theme-"));
      existing.forEach((c) => root.classList.remove(c));
      root.classList.add(cls);
    }

    // Eye tint: set data-theme on html (used for warm sepia overlay only)
    if (m === "eye") {
      document.documentElement.dataset.theme = "eye";
    } else {
      delete document.documentElement.dataset.theme;
    }

    localStorage.setItem(storageKey(theme), m);
  }

  function handleMode(m: Mode) {
    setMode(m);
    applyMode(m, siteTheme);
    setOpen(false);
  }

  async function applyLocale(l: Locale) {
    if (l === currentLocale || saving) return;
    setSaving(true);
    setCurrentLocale(l);
    const res = await fetch("/api/preferences/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: l }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setCurrentLocale(locale);
      setSaving(false);
    }
  }

  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <div ref={ref} className="relative text-xs uppercase tracking-[0.2em]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="snap-transition theme-border-thin flex items-center gap-2 px-3 py-1"
        aria-expanded={open}
      >
        <span>{activeMode.icon}</span>
        <span>{activeMode.label}</span>
        <span className="opacity-40">/</span>
        <span>{currentLocale.toUpperCase()}</span>
        <span className="opacity-40">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-[var(--fg)] bg-[var(--bg)] py-1 shadow-lg">
          <p className="px-3 py-1 opacity-40">Theme</p>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleMode(m.id)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition-opacity hover:opacity-70 ${
                mode === m.id ? "opacity-100 font-semibold" : "opacity-60"
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
              {mode === m.id && <span className="ml-auto">✓</span>}
            </button>
          ))}

          <div className="my-1 border-t border-[var(--fg)] opacity-20" />

          <p className="px-3 py-1 opacity-40">Language</p>
          {LOCALES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => void applyLocale(l.id)}
              disabled={saving}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition-opacity hover:opacity-70 ${
                currentLocale === l.id ? "opacity-100 font-semibold" : "opacity-60"
              }`}
            >
              <span>{l.label}</span>
              {currentLocale === l.id && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
