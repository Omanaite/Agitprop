"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";
import {
  DEFAULT_TENANT_THEMES,
  AKEMI_TENANT_THEME,
  type TenantTheme,
} from "@/lib/tenants/theme";

const THEME_LABELS: Record<string, string> = {
  atelier: "Atelier",
  mono: "Mono",
  ink: "Ink",
  akemi_brutalist: "Akemi Brutalist",
};

const THEME_DESCRIPTIONS: Record<string, string> = {
  atelier: "Warm, gallery-style presentation with editorial spacing.",
  mono: "Clean monochrome aesthetic for a minimal portfolio look.",
  ink: "Dark, high-contrast layout built for tattoo portfolios.",
  akemi_brutalist: "Exclusive Akemi pilot theme. Cannot be changed.",
};

export function StudioSiteSettings() {
  const [currentTheme, setCurrentTheme] = useState<TenantTheme>("atelier");
  const [selectedTheme, setSelectedTheme] = useState<TenantTheme>("atelier");
  const [isAkemi, setIsAkemi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);

  async function load() {
    setIsLoading(true);
    setStatus("");
    const res = await fetch("/api/studio/profile");
    if (!res.ok) {
      setStatus("Could not load site settings.");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    const theme: TenantTheme = data.profile?.site_theme ?? "atelier";
    setCurrentTheme(theme);
    setSelectedTheme(theme);
    setIsAkemi(theme === AKEMI_TENANT_THEME);
    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setStatus("");
    setIsError(false);
    setIsSaving(true);

    const res = await fetch("/api/studio/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_theme: selectedTheme }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setStatus(data?.message ?? "Failed to save site theme.");
      setIsError(true);
      setIsSaving(false);
      return;
    }

    const data = await res.json();
    const saved: TenantTheme = data.site_theme ?? selectedTheme;
    setCurrentTheme(saved);
    setSelectedTheme(saved);
    setStatus("Site theme saved.");
    setIsError(false);
    setIsSaving(false);
  }

  if (isLoading) {
    return <AdminSectionSkeleton fields={3} cards={0} />;
  }

  const isDirty = selectedTheme !== currentTheme;

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Appearance</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Site Theme</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Choose the visual theme for your public-facing artist site.
      </p>

      {isAkemi ? (
        <div className="mt-6">
          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-accent-soft)] px-5 py-4">
            <p className="text-sm font-semibold text-[var(--admin-title)]">
              {THEME_LABELS[AKEMI_TENANT_THEME]}
            </p>
            <p className="admin-muted mt-1 text-xs leading-5">
              {THEME_DESCRIPTIONS[AKEMI_TENANT_THEME]}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {DEFAULT_TENANT_THEMES.map((theme) => {
            const isSelected = selectedTheme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={[
                  "rounded-2xl border px-5 py-4 text-left transition",
                  isSelected
                    ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] shadow-sm"
                    : "border-[var(--admin-border)] hover:bg-[var(--admin-accent-soft)]",
                ].join(" ")}
                aria-pressed={isSelected}
              >
                <span className="block text-sm font-semibold text-[var(--admin-title)]">
                  {THEME_LABELS[theme]}
                </span>
                <span className="admin-muted mt-1 block text-xs leading-5">
                  {THEME_DESCRIPTIONS[theme]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!isAkemi && (
        <div className="mt-5">
          <button
            type="button"
            className="admin-button admin-button-primary"
            onClick={() => void handleSave()}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      {status ? (
        <p
          className="admin-validation mt-4"
          data-variant={isError ? "error" : "success"}
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
    </section>
  );
}
