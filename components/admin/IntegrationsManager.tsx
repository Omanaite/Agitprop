"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Integration = {
  id: string;
  provider: string;
  status: "connected" | "disconnected" | "expired";
  external_user_id?: string | null;
  connected_at?: string | null;
};

type ValidationError = { path: string; message: string };

const providers = ["google", "github", "facebook", "dropbox", "drive", "s3"];

export function IntegrationsManager() {
  const [items, setItems] = useState<Integration[]>([]);
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
    const res = await fetch("/api/admin/integrations");
    if (!res.ok) {
      setStatus("Could not load integrations.");
      setIsLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
    setIsLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <AdminSectionSkeleton fields={2} cards={6} />;
  }

  async function updateIntegration(provider: string, statusValue: Integration["status"]) {
    setStatus("");
    setErrors([]);
    setIsSaving(true);
    const res = await fetch("/api/admin/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        status: statusValue,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrors(data?.errors ?? []);
      setStatus(data?.message ?? "Failed to update integration.");
      setIsSaving(false);
      return;
    }

    await load();
    setStatus("Integration updated.");
    setIsSaving(false);
  }

  const connectedCount = items.filter((item) => item.status === "connected").length;

  function connectProvider(provider: string) {
    window.location.href = `/api/admin/integrations/oauth?provider=${provider}`;
  }

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Connections</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Integrations</h2>
      <p className="admin-muted mt-2 mb-4 text-sm leading-6">
        Connect OAuth and cloud. Remote uploads unlock only when connected.
      </p>

      {connectedCount === 0 ? (
        <p className="admin-validation mb-4" data-variant="error">
          No active integrations. Remote uploads are blocked.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => {
          const current = items.find((item) => item.provider === provider);
          return (
            <div key={provider} className="admin-card-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-muted)]">
                  {provider}
                </div>
                <span className="admin-chip">
                  {current?.status ?? "disconnected"}
                </span>
              </div>
              <div className="admin-muted mt-3 text-sm">
                Status: {current?.status ?? "disconnected"}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="admin-button"
                  disabled={isSaving}
                  onClick={() => connectProvider(provider)}
                >
                  Connect
                </button>
                <button
                  type="button"
                  className="admin-button admin-button-danger"
                  disabled={isSaving}
                  onClick={() => void updateIntegration(provider, "disconnected")}
                >
                  Disconnect
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
      {errorMap.size ? null : null}
    </section>
  );
}
