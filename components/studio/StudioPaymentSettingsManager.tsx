"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type PaymentSettings = {
  mode: "test" | "live";
  stripe_account_id?: string;
  stripe_public_reference?: string;
  paypal_merchant_email?: string;
  paypal_merchant_id?: string;
  notes?: string;
};

type ValidationError = { path: string; message: string };

const emptySettings: PaymentSettings = {
  mode: "test",
  stripe_account_id: "",
  stripe_public_reference: "",
  paypal_merchant_email: "",
  paypal_merchant_id: "",
  notes: "",
};

export function StudioPaymentSettingsManager() {
  const [settings, setSettings] = useState<PaymentSettings>(emptySettings);
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
    const res = await fetch("/api/studio/payment-settings");
    if (!res.ok) {
      setStatus("Could not load payment settings.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    setSettings(data.settings || emptySettings);
    if (data.fallback) {
      setStatus(
        "Payment settings are in fallback mode. Run the latest Supabase schema to persist changes."
      );
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <AdminSectionSkeleton fields={5} cards={0} />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    setErrors([]);
    setIsSaving(true);

    const res = await fetch("/api/studio/payment-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to save payment settings.");
      setIsSaving(false);
      return;
    }

    setStatus("Payment settings saved.");
    setIsSaving(false);
  }

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Billing</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">
        Payment Settings
      </h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Configure your Stripe and PayPal references for studio operations.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <select
          className="admin-select"
          value={settings.mode}
          onChange={(e) =>
            setSettings({ ...settings, mode: e.target.value as "test" | "live" })
          }
        >
          <option value="test">test</option>
          <option value="live">live</option>
        </select>
        <input
          className="admin-input"
          placeholder="Stripe account id (optional)"
          value={settings.stripe_account_id || ""}
          onChange={(e) =>
            setSettings({ ...settings, stripe_account_id: e.target.value })
          }
        />
        <input
          className="admin-input"
          placeholder="Stripe public reference"
          value={settings.stripe_public_reference || ""}
          onChange={(e) =>
            setSettings({ ...settings, stripe_public_reference: e.target.value })
          }
        />
        <input
          className={`admin-input ${
            errorMap.get("paypal_merchant_email") ? "admin-field-error" : ""
          }`}
          placeholder="PayPal merchant email"
          value={settings.paypal_merchant_email || ""}
          onChange={(e) =>
            setSettings({ ...settings, paypal_merchant_email: e.target.value })
          }
          type="email"
        />
        <input
          className="admin-input md:col-span-2"
          placeholder="PayPal merchant id (optional)"
          value={settings.paypal_merchant_id || ""}
          onChange={(e) =>
            setSettings({ ...settings, paypal_merchant_id: e.target.value })
          }
        />
        <textarea
          className="admin-textarea min-h-[110px] md:col-span-2"
          placeholder="Internal payment notes"
          value={settings.notes || ""}
          onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
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
    </section>
  );
}
