"use client";

import { useEffect, useMemo, useState } from "react";

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

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/profile");
    if (!res.ok) {
      setStatus("Could not load profile.");
      return;
    }
    const data = await res.json();
    setProfile(data.profile || emptyProfile);
  }

  useEffect(() => {
    void load();
  }, []);

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
    <section className="theme-border p-4">
      <h2 className="mb-2 text-lg uppercase">Admin Profile</h2>
      <p className="mb-4 text-xs uppercase tracking-[0.2em]">
        Base data for billing, payments, and contact.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input
          className={`theme-border p-2 ${
            errorMap.get("email") ? "input-error" : ""
          }`}
          placeholder="Email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          type="email"
          required
        />
        {errorMap.get("email") ? (
          <p className="input-helper" data-variant="error">
            email: {errorMap.get("email")}
          </p>
        ) : null}
        <input
          className="theme-border p-2"
          placeholder="Nickname"
          value={profile.nickname || ""}
          onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
        />
        <input
          className="theme-border p-2 md:col-span-2"
          placeholder="Shipping address"
          value={profile.shipping_address || ""}
          onChange={(e) =>
            setProfile({ ...profile, shipping_address: e.target.value })
          }
        />
        <input
          className="theme-border p-2 md:col-span-2"
          placeholder="Billing address"
          value={profile.billing_address || ""}
          onChange={(e) =>
            setProfile({ ...profile, billing_address: e.target.value })
          }
        />
        <textarea
          className="theme-border p-2 md:col-span-2 min-h-[80px]"
          placeholder="Payment notes (internal references)"
          value={profile.payment_notes || ""}
          onChange={(e) =>
            setProfile({ ...profile, payment_notes: e.target.value })
          }
        />
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="theme-border theme-invert px-4 py-2"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
      {status ? (
        <p
          className="validation-box mt-3"
          data-variant={errors.length ? "error" : "success"}
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
      {errors.length ? (
        <ul className="validation-list" aria-live="polite">
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
