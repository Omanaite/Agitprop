"use client";

import { useEffect, useState } from "react";

type MktTheme = "light" | "dark" | "eye";

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

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={cycle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-base mkt-muted hover:text-[var(--mkt-fg)] transition-colors"
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>
      <button
        type="button"
        onClick={toggleEye}
        aria-label={theme === "eye" ? "Disable eye care mode" : "Enable eye care mode"}
        aria-pressed={theme === "eye"}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors ${
          theme === "eye"
            ? "text-[var(--mkt-fg)]"
            : "mkt-muted hover:text-[var(--mkt-fg)]"
        }`}
      >
        👁
      </button>
    </div>
  );
}
