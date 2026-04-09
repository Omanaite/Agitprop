"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Theme = "light" | "eye" | "dark";

type Props = {
  locale: Locale;
};

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "○" },
  { id: "eye",   label: "Eye",   icon: "◎" },
  { id: "dark",  label: "Dark",  icon: "●" },
];

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "de", label: "DE" },
];

export function SitePreferencesMenu({ locale }: Props) {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Init theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function applyTheme(t: Theme) {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    localStorage.setItem("theme", t);
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

  const activeTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={ref} className="relative text-xs uppercase tracking-[0.2em]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="snap-transition theme-border-thin flex items-center gap-2 px-3 py-1"
        aria-expanded={open}
      >
        <span>{activeTheme.icon}</span>
        <span>{activeTheme.label}</span>
        <span className="opacity-40">/</span>
        <span>{currentLocale.toUpperCase()}</span>
        <span className="opacity-40">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-[var(--fg)] bg-[var(--bg)] py-1 shadow-lg">
          {/* Theme section */}
          <p className="px-3 py-1 opacity-40">Theme</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { applyTheme(t.id); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition-opacity hover:opacity-70 ${
                theme === t.id ? "opacity-100 font-semibold" : "opacity-60"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {theme === t.id && <span className="ml-auto">✓</span>}
            </button>
          ))}

          {/* Divider */}
          <div className="my-1 border-t border-[var(--fg)] opacity-20" />

          {/* Locale section */}
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
