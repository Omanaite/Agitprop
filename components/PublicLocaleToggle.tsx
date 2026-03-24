"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type PublicLocaleToggleProps = {
  locale: Locale;
  label: string;
};

const locales: Array<{ id: Locale; label: string }> = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "de", label: "DE" },
];

export function PublicLocaleToggle({
  locale,
  label,
}: PublicLocaleToggleProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [isSaving, setIsSaving] = useState(false);

  async function applyLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale || isSaving) return;
    setCurrentLocale(nextLocale);
    setIsSaving(true);

    const response = await fetch("/api/preferences/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
    });

    if (!response.ok) {
      setCurrentLocale(locale);
      setIsSaving(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em]">
      <span>{label}</span>
      {locales.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => applyLocale(item.id)}
          aria-pressed={currentLocale === item.id}
          disabled={isSaving}
          className={`snap-transition theme-border-thin px-2 py-1 ${
            currentLocale === item.id ? "theme-invert" : ""
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
