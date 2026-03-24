"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "eye";

type ThemeToggleProps = {
  labels?: {
    light: string;
    eye: string;
    dark: string;
  };
};

export function ThemeToggle({
  labels = { light: "Light", eye: "Eye", dark: "Dark" },
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return (localStorage.getItem("theme") as Theme | null) ?? "light";
  });
  const themes: { id: Theme; label: string }[] = [
    { id: "light", label: labels.light },
    { id: "eye", label: labels.eye },
    { id: "dark", label: labels.dark },
  ];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
      {themes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setTheme(item.id)}
          aria-pressed={theme === item.id}
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
