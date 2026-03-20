"use client";

import { useEffect, useState } from "react";
import { localeCookieName, type Locale } from "@/lib/i18n";

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

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  function applyLocale(nextLocale: Locale) {
    setCurrentLocale(nextLocale);
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
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
