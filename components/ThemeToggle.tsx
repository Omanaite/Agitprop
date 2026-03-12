"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "eye";

const themes: { id: Theme; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "eye", label: "Eye" },
  { id: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "light";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
    setMounted(true);
  }, []);

  function applyTheme(next: Theme) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
      {themes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => applyTheme(item.id)}
          className={`snap-transition theme-border-thin px-2 py-1 ${
            theme === item.id ? "theme-invert" : ""
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

