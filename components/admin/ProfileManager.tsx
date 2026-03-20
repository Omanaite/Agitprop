"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Profile = {
  email: string;
  nickname?: string;
  shipping_address?: string;
  billing_address?: string;
  payment_notes?: string;
};

type ValidationError = { path: string; message: string };

const emptyProfile: Profile = {
  email: "",
  nickname: "",
  shipping_address: "",
  billing_address: "",
  payment_notes: "",
};

export function ProfileManager() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const errorMap = useMemo(
    () => new Map(errors.map((error) => [error.path, error.message])),
    [errors]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setStatus("");
    setErrors([]);
    setIsLoading(true);
    const res = await fetch("/api/admin/profile");
    if (!res.ok) {
      setStatus("Could not load profile.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    setProfile(data.profile || emptyProfile);
    setIsLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <AdminSectionSkeleton fields={4} cards={0} />;
  }

  function validateProfile(): ValidationError[] {
    const nextErrors: ValidationError[] = [];
    if (!profile.email?.trim()) {
      nextErrors.push({ path: "email", message: "Required" });
    }
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);

    const clientErrors = validateProfile();
    if (clientErrors.length) {
      setErrors(clientErrors);
      setStatus("Required fields are missing.");
      return;
    }

    setIsSaving(true);
    const res = await fetch("/api/admin/profile", {
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
      <h2 className="admin-title mt-4 text-2xl font-semibold">Admin Profile</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Keep the operational identity of the studio aligned across billing,
        shipping, and internal payment references.
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
        <div className="flex flex-wrap gap-2 md:col-span-2">
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
      {errors.length ? (
        <ul className="mt-3 space-y-1 text-sm text-[var(--admin-danger)]" aria-live="polite">
          {errors.map((error) => (
            <li key={`${error.path}-${error.message}`}>
              {error.path}: {error.message}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
