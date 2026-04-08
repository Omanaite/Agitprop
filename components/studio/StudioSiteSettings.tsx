"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";
import { useStudioPreview } from "@/lib/studio-preview-context";
import {
  DEFAULT_TENANT_THEMES,
  AKEMI_TENANT_THEME,
  type TenantTheme,
} from "@/lib/tenants/theme";

const THEME_LABELS: Record<string, string> = {
  atelier: "Atelier",
  mono: "Mono",
  ink: "Ink",
  verdure: "Verdure",
  amber: "Amber",
  akemi_brutalist: "Custom",
};

const THEME_DESCRIPTIONS: Record<string, string> = {
  atelier: "Warm gallery editorial. Cream background, serif typography.",
  mono: "Swiss clean minimalism. Pure white, Helvetica, thin borders.",
  ink: "Dark dramatic. Deep charcoal background, light text.",
  verdure: "Organic nature. Sage-green tones, earthy palette, serif.",
  amber: "Warm studio. Amber-tinted background, editorial serif feel.",
  akemi_brutalist: "Custom theme. Cannot be changed.",
};

export function StudioSiteSettings() {
  const { refreshPreview } = useStudioPreview();
  const [currentTheme, setCurrentTheme] = useState<TenantTheme>("atelier");
  const [selectedTheme, setSelectedTheme] = useState<TenantTheme>("atelier");
  const [isAkemi, setIsAkemi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);

  // Custom domain state
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [domainStatus, setDomainStatus] = useState("");
  const [domainError, setDomainError] = useState(false);
  const [domainVerification, setDomainVerification] = useState<{ type: string; domain: string; value: string; reason: string }[]>([]);
  const [isSavingDomain, setIsSavingDomain] = useState(false);
  const [isRemovingDomain, setIsRemovingDomain] = useState(false);

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

    // Load domain
    const domainRes = await fetch("/api/studio/domain");
    if (domainRes.ok) {
      const domainData = await domainRes.json();
      setCurrentDomain(domainData.domain ?? null);
      setDomainInput(domainData.domain ?? "");
    }
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
    refreshPreview();
  }

  async function handleDomainSave() {
    setDomainStatus("");
    setDomainError(false);
    setDomainVerification([]);
    setIsSavingDomain(true);
    const res = await fetch("/api/studio/domain", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: domainInput }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setDomainStatus(data?.message ?? "Failed to save domain.");
      setDomainError(true);
    } else {
      setCurrentDomain(data.domain);
      setDomainVerification(data.verification ?? []);
      setDomainStatus(data.verification?.length
        ? "Domain saved. Configure DNS records below, then wait for propagation."
        : "Domain saved.");
      setDomainError(false);
    }
    setIsSavingDomain(false);
  }

  async function handleDomainRemove() {
    setDomainStatus("");
    setIsRemovingDomain(true);
    const res = await fetch("/api/studio/domain", { method: "DELETE" });
    if (res.ok) {
      setCurrentDomain(null);
      setDomainInput("");
      setDomainVerification([]);
      setDomainStatus("Domain removed.");
      setDomainError(false);
    } else {
      setDomainStatus("Failed to remove domain.");
      setDomainError(true);
    }
    setIsRemovingDomain(false);
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
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

    <section className="admin-card mt-6 p-6 md:p-7">
      <p className="admin-chip">Custom Domain</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Your Domain</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Point your own domain to your artist site. Buy your domain from any registrar
        (including Vercel), then enter it here. We&apos;ll register it and show you the
        DNS records to configure.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="admin-label mb-1 block text-xs uppercase tracking-[0.15em] opacity-60">
            Domain
          </label>
          <input
            type="text"
            className="admin-input w-full"
            placeholder="mysite.com"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            disabled={isSavingDomain}
          />
        </div>
        <button
          type="button"
          className="admin-button admin-button-primary shrink-0"
          onClick={() => void handleDomainSave()}
          disabled={isSavingDomain || !domainInput.trim() || domainInput.trim() === currentDomain}
        >
          {isSavingDomain ? "Saving..." : "Save domain"}
        </button>
        {currentDomain && (
          <button
            type="button"
            className="admin-button admin-button-ghost shrink-0 text-red-500 hover:text-red-600"
            onClick={() => void handleDomainRemove()}
            disabled={isRemovingDomain}
          >
            {isRemovingDomain ? "Removing..." : "Remove"}
          </button>
        )}
      </div>

      {domainVerification.length > 0 && (
        <div className="mt-5 rounded-xl border border-[var(--admin-border)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-70">
            DNS Records to Configure
          </p>
          <p className="admin-muted mt-1 text-xs leading-5">
            Add these records at your DNS provider. Changes can take up to 24 hours to propagate.
          </p>
          <div className="mt-3 grid gap-2">
            {domainVerification.map((v, i) => (
              <div key={i} className="rounded-lg bg-[var(--admin-accent-soft)] px-4 py-3 font-mono text-xs">
                <span className="opacity-60">{v.type}</span>{" "}
                <span className="font-semibold">{v.domain}</span>{" "}
                <span className="opacity-80">→ {v.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {domainStatus && (
        <p
          className="admin-validation mt-4"
          data-variant={domainError ? "error" : "success"}
          aria-live="polite"
        >
          {domainStatus}
        </p>
      )}
    </section>
  );
}
