"use client";

import { useEffect, useState } from "react";

type MktTheme = "light" | "dark" | "eye";

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconEye({ crossed }: { crossed?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      {crossed && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

export function MktThemeToggle() {
  const [theme, setTheme] = useState<MktTheme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as MktTheme | null;
    if (stored) setTheme(stored);
  }, []);

  function cycle() {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      return next;
    });
  }

  function toggleEye() {
    setTheme((t) => {
      const next = t === "eye" ? "light" : "eye";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      return next;
    });
  }

  const isDark = theme === "dark";
  const isEye = theme === "eye";

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={cycle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-8 w-8 items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
      >
        {isDark ? <IconSun /> : <IconMoon />}
      </button>
      <button
        type="button"
        onClick={toggleEye}
        aria-label={isEye ? "Disable eye care mode" : "Enable eye care mode"}
        aria-pressed={isEye}
        className={`flex h-8 w-8 items-center justify-center transition-opacity ${
          isEye ? "opacity-100" : "opacity-50 hover:opacity-100"
        }`}
      >
        <IconEye crossed={isEye} />
      </button>
    </div>
  );
}
