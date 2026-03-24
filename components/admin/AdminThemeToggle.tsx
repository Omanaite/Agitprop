"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "eye";

const themes: { id: Theme; label: string }[] = [
  { id: "light", label: "Normal" },
  { id: "eye", label: "Eye" },
  { id: "dark", label: "Dark" },
];

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return (localStorage.getItem("theme") as Theme | null) ?? "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="inline-flex rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-strong)] p-1 shadow-sm">
      {themes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setTheme(item.id)}
          aria-pressed={theme === item.id}
          className={`rounded-full px-3 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition ${
            theme === item.id
              ? "bg-[var(--admin-accent)] text-white"
              : "text-[var(--admin-muted)]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
