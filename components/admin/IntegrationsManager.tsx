"use client";

import { useEffect, useMemo, useState } from "react";

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

  async function load() {
    setStatus("");
    setErrors([]);
    const res = await fetch("/api/admin/integrations");
    if (!res.ok) {
      setStatus("Could not load integrations.");
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

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
    <section className="theme-border p-4">
      <h2 className="mb-2 text-lg uppercase">Integrations</h2>
      <p className="mb-4 text-xs uppercase tracking-[0.2em]">
        Connect OAuth and cloud. Remote uploads unlock only when connected.
      </p>

      {connectedCount === 0 ? (
        <p className="input-helper" data-variant="error">
          No active integrations. Remote uploads are blocked.
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {providers.map((provider) => {
          const current = items.find((item) => item.provider === provider);
          return (
            <div key={provider} className="theme-border p-3">
              <div className="text-xs uppercase tracking-[0.2em]">{provider}</div>
              <div className="text-sm">
                Status: {current?.status ?? "disconnected"}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="theme-border px-3 py-1 text-xs"
                  disabled={isSaving}
                  onClick={() => connectProvider(provider)}
                >
                  Connect
                </button>
                <button
                  type="button"
                  className="theme-border px-3 py-1 text-xs"
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
      {errorMap.size ? null : null}
    </section>
  );
}
