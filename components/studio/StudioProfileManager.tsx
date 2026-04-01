"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Profile = {
  email: string;
  nickname?: string;
  shipping_address?: string;
  billing_address?: string;
  payment_notes?: string;
  slug?: string;
  studio_name?: string;
};

type ValidationError = { path: string; message: string };

const emptyProfile: Profile = {
  email: "",
  nickname: "",
  shipping_address: "",
  billing_address: "",
  payment_notes: "",
  slug: "",
  studio_name: "",
};

const PLATFORM_HOST =
  typeof window !== "undefined" ? window.location.host : "agitpropstudio.vercel.app";

function sanitizeSlugInput(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+/, "");
}

export function StudioProfileManager() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [slugInput, setSlugInput] = useState("");
  const [slugStatus, setSlugStatus] = useState("");
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [studioNameInput, setStudioNameInput] = useState("");
  const [studioNameStatus, setStudioNameStatus] = useState("");
  const [isSavingStudioName, setIsSavingStudioName] = useState(false);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const errorMap = useMemo(
    () => new Map(errors.map((error) => [error.path, error.message])),
    [errors]
  );

  async function load() {
    setStatus("");
    setErrors([]);
    setIsLoading(true);
    const res = await fetch("/api/studio/profile");
    if (!res.ok) {
      setStatus("Could not load profile.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    const p = data.profile || emptyProfile;
    setProfile(p);
    setSlugInput(p.slug || "");
    setStudioNameInput(p.studio_name || "");
    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  async function handleSlugSave() {
    setSlugStatus("");
    const trimmed = slugInput.trim().replace(/-+$/, "");
    if (!trimmed || trimmed.length < 2) {
      setSlugStatus("Page name must be at least 2 characters.");
      return;
    }
    setIsSavingSlug(true);
    const res = await fetch("/api/studio/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: trimmed }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setSlugStatus(data?.message ?? "Failed to save page name.");
    } else {
      setProfile((p) => ({ ...p, slug: data.slug }));
      setSlugInput(data.slug);
      setSlugStatus("Page name saved.");
    }
    setIsSavingSlug(false);
  }

  async function handleStudioNameSave() {
    setStudioNameStatus("");
    const trimmed = studioNameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setStudioNameStatus("Studio name must be at least 2 characters.");
      return;
    }
    setIsSavingStudioName(true);
    const res = await fetch("/api/studio/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studio_name: trimmed }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStudioNameStatus(data?.message ?? "Failed to save studio name.");
    } else {
      setProfile((p) => ({ ...p, studio_name: data.studio_name }));
      setStudioNameInput(data.studio_name);
      setStudioNameStatus("Studio name saved.");
    }
    setIsSavingStudioName(false);
  }

  if (isLoading) {
    return <AdminSectionSkeleton fields={4} cards={0} />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);

    if (!profile.email?.trim()) {
      setErrors([{ path: "email", message: "Required" }]);
      setStatus("Required fields are missing.");
      return;
    }

    setIsSaving(true);
    const res = await fetch("/api/studio/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to save profile.");
      setIsSaving(false);
      return;
    }

    setStatus("Profile saved.");
    setIsSaving(false);
  }

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Identity</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Studio Profile</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Keep your public studio identity and payout references updated.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input
          className={`admin-input ${
            errorMap.get("email") ? "admin-field-error" : ""
          }`}
          placeholder="Email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          type="email"
          required
        />
        {errorMap.get("email") ? (
          <p className="admin-helper" data-variant="error">
            email: {errorMap.get("email")}
          </p>
        ) : null}
        <input
          className="admin-input"
          placeholder="Nickname"
          value={profile.nickname || ""}
          onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
        />
        <input
          className="admin-input md:col-span-2"
          placeholder="Shipping address"
          value={profile.shipping_address || ""}
          onChange={(e) =>
            setProfile({ ...profile, shipping_address: e.target.value })
          }
        />
        <input
          className="admin-input md:col-span-2"
          placeholder="Billing address"
          value={profile.billing_address || ""}
          onChange={(e) =>
            setProfile({ ...profile, billing_address: e.target.value })
          }
        />
        <textarea
          className="admin-textarea md:col-span-2 min-h-[120px]"
          placeholder="Payment notes (internal references)"
          value={profile.payment_notes || ""}
          onChange={(e) =>
            setProfile({ ...profile, payment_notes: e.target.value })
          }
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            className="admin-button admin-button-primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
      {status ? (
        <p
          className="admin-validation mt-4"
          data-variant={errors.length ? "error" : "success"}
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}

      <div className="mt-8 border-t border-[var(--admin-border)] pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--admin-muted)]">
          Studio name
        </p>
        <p className="admin-muted mt-2 text-sm leading-6">
          This is the name that appears as the title on your public artist site.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="admin-input flex-1"
            placeholder="e.g. Black Serpent Studio"
            value={studioNameInput}
            maxLength={80}
            onChange={(e) => setStudioNameInput(e.target.value)}
          />
          <button
            type="button"
            className="admin-button admin-button-primary shrink-0"
            disabled={isSavingStudioName || studioNameInput.trim() === (profile.studio_name ?? "")}
            onClick={handleStudioNameSave}
          >
            {isSavingStudioName ? "Saving…" : "Save studio name"}
          </button>
        </div>
        {studioNameStatus ? (
          <p
            className="admin-validation mt-3"
            data-variant={studioNameStatus.includes("saved") ? "success" : "error"}
            aria-live="polite"
          >
            {studioNameStatus}
          </p>
        ) : null}
      </div>

      <div className="mt-6 border-t border-[var(--admin-border)] pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--admin-muted)]">
          Page name
        </p>
        <p className="admin-muted mt-2 text-sm leading-6">
          Choose the URL for your public artist site. Only lowercase letters,
          numbers, and hyphens.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="flex items-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-input-bg)] px-4 py-3 focus-within:border-[var(--admin-accent)] focus-within:ring-1 focus-within:ring-[var(--admin-accent)]">
              <span className="admin-muted shrink-0 select-none text-sm">
                {PLATFORM_HOST}/
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--admin-title)] outline-none placeholder:text-[var(--admin-muted)]"
                placeholder="your-studio-name"
                value={slugInput}
                maxLength={50}
                onChange={(e) =>
                  setSlugInput(sanitizeSlugInput(e.target.value))
                }
              />
            </div>
            {slugInput && (
              <p className="admin-muted mt-1 text-xs">
                {PLATFORM_HOST}/{slugInput || "…"}
              </p>
            )}
          </div>
          <button
            type="button"
            className="admin-button admin-button-primary shrink-0"
            disabled={isSavingSlug || slugInput === (profile.slug ?? "")}
            onClick={handleSlugSave}
          >
            {isSavingSlug ? "Saving…" : "Save page name"}
          </button>
        </div>
        {profile.slug && (
          <a
            href={`/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--admin-accent)] hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M4.5 11.5a.75.75 0 0 1-.75-.75V4.56L2.28 6.03a.75.75 0 0 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1-1.06 1.06L4.75 4.56v6.19a.75.75 0 0 1-.75.75Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M9.5 4.5a.75.75 0 0 1 .75.75v6.19l1.47-1.47a.75.75 0 1 1 1.06 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.47 1.47V5.25A.75.75 0 0 1 9.5 4.5Z"
                clipRule="evenodd"
              />
            </svg>
            Open {PLATFORM_HOST}/{profile.slug}
          </a>
        )}
        {slugStatus ? (
          <p
            className="admin-validation mt-3"
            data-variant={slugStatus.includes("saved") ? "success" : "error"}
            aria-live="polite"
          >
            {slugStatus}
          </p>
        ) : null}
      </div>
    </section>
  );
}
