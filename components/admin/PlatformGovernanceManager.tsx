"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Tenant = {
  id: string;
  studio_name: string;
  slug: string;
  status: "active" | "inactive" | "suspended";
  plan_code: "free" | "premium";
  site_theme: "atelier" | "mono" | "ink" | "akemi_brutalist";
  custom_domain?: string | null;
  owner_user_id: string;
};

type PlatformIntegration = {
  provider: string;
  is_enabled: boolean;
  maintenance_message?: string | null;
};

export function PlatformGovernanceManager() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isSavingTenant, setIsSavingTenant] = useState<string | null>(null);
  const [isSavingIntegration, setIsSavingIntegration] = useState<string | null>(
    null
  );
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [newTenant, setNewTenant] = useState({
    owner_user_id: "",
    studio_name: "",
    slug: "",
    plan_code: "free" as Tenant["plan_code"],
    site_theme: "atelier" as Tenant["site_theme"],
  });

  async function load() {
    setIsLoading(true);
    setStatus("");

    const [tenantRes, integrationRes] = await Promise.all([
      fetch("/api/admin/platform-tenants"),
      fetch("/api/admin/platform-integrations"),
    ]);

    const tenantData = await tenantRes.json().catch(() => null);
    const integrationData = await integrationRes.json().catch(() => null);

    if (!tenantRes.ok || !integrationRes.ok) {
      setStatus("Could not load platform governance data.");
      setIsLoading(false);
      return;
    }

    setTenants((tenantData?.tenants ?? []) as Tenant[]);
    setIntegrations((integrationData?.integrations ?? []) as PlatformIntegration[]);

    if (tenantData?.fallback || integrationData?.fallback) {
      setStatus("Fallback mode: apply latest schema to persist all governance changes.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function updateTenant(
    tenantId: string,
    payload: {
      status?: Tenant["status"];
      plan_code?: Tenant["plan_code"];
      site_theme?: Tenant["site_theme"];
      custom_domain?: string;
    }
  ) {
    setIsSavingTenant(tenantId);
    setStatus("");

    const res = await fetch("/api/admin/platform-tenants", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        ...payload,
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(data?.message ?? "Failed to update tenant.");
      setIsSavingTenant(null);
      return;
    }

    setStatus("Tenant updated.");
    setTenants((current) =>
      current.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, ...payload } : tenant
      )
    );
    setIsSavingTenant(null);
  }

  async function createTenant(event: React.FormEvent) {
    event.preventDefault();
    setIsCreatingTenant(true);
    setStatus("");
    const res = await fetch("/api/admin/platform-tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner_user_id: newTenant.owner_user_id.trim(),
        studio_name: newTenant.studio_name.trim(),
        slug: newTenant.slug.trim(),
        plan_code: newTenant.plan_code,
        site_theme: newTenant.site_theme,
        status: "active",
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const fieldErrors: string[] = (data?.errors ?? []).map(
        (e: { path: string; message: string }) => `${e.path}: ${e.message}`
      );
      setStatus(
        fieldErrors.length
          ? fieldErrors.join(" · ")
          : (data?.message ?? "Failed to create tenant.")
      );
      setIsCreatingTenant(false);
      return;
    }
    setNewTenant({
      owner_user_id: "",
      studio_name: "",
      slug: "",
      plan_code: "free",
      site_theme: "atelier",
    });
    await load();
    setStatus("Tenant created.");
    setIsCreatingTenant(false);
  }

  async function deleteTenant(tenantId: string) {
    if (!confirm("Delete this tenant and memberships?")) return;
    setIsSavingTenant(tenantId);
    setStatus("");
    const res = await fetch("/api/admin/platform-tenants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_id: tenantId }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(data?.message ?? "Failed to delete tenant.");
      setIsSavingTenant(null);
      return;
    }
    await load();
    setStatus("Tenant deleted.");
    setIsSavingTenant(null);
  }

  async function updateIntegration(
    provider: string,
    payload: { is_enabled: boolean; maintenance_message?: string | null }
  ) {
    setIsSavingIntegration(provider);
    setStatus("");

    const res = await fetch("/api/admin/platform-integrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        ...payload,
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(data?.message ?? "Failed to update integration.");
      setIsSavingIntegration(null);
      return;
    }

    setStatus("Integration policy updated.");
    setIntegrations((current) =>
      current.map((item) =>
        item.provider === provider ? { ...item, ...payload } : item
      )
    );
    setIsSavingIntegration(null);
  }

  if (isLoading) {
    return <AdminSectionSkeleton fields={4} cards={2} />;
  }

  return (
    <div className="grid gap-5">
      <section className="admin-card p-5">
        <p className="admin-chip">Tenants</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">Artist Sites</h2>
        <p className="admin-muted mt-2 text-sm leading-6">
          Control lifecycle and plan access for each artist tenant.
        </p>

        <form onSubmit={createTenant} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="admin-input"
            placeholder="Owner user UUID"
            value={newTenant.owner_user_id}
            onChange={(event) =>
              setNewTenant((current) => ({
                ...current,
                owner_user_id: event.target.value,
              }))
            }
            required
          />
          <input
            className="admin-input"
            placeholder="Studio name"
            value={newTenant.studio_name}
            onChange={(event) =>
              setNewTenant((current) => ({
                ...current,
                studio_name: event.target.value,
              }))
            }
            required
          />
          <input
            className="admin-input"
            placeholder="Slug"
            value={newTenant.slug}
            onChange={(event) =>
              setNewTenant((current) => ({
                ...current,
                slug: event.target.value,
              }))
            }
            required
          />
          <div className="flex gap-2">
            <select
              className="admin-input min-w-[120px]"
              value={newTenant.plan_code}
              onChange={(event) =>
                setNewTenant((current) => ({
                  ...current,
                  plan_code: event.target.value as Tenant["plan_code"],
                }))
              }
            >
              <option value="free">free</option>
              <option value="premium">premium</option>
            </select>
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={isCreatingTenant}
            >
              {isCreatingTenant ? "Creating..." : "Create tenant"}
            </button>
          </div>
          <select
            className="admin-input min-w-[140px]"
            value={newTenant.site_theme}
            onChange={(event) =>
              setNewTenant((current) => ({
                ...current,
                site_theme: event.target.value as Tenant["site_theme"],
              }))
            }
          >
            <option value="atelier">atelier</option>
            <option value="mono">mono</option>
            <option value="ink">ink</option>
          </select>
        </form>

        <div className="mt-4 space-y-3">
          {tenants.length ? (
            tenants.map((tenant) => (
              <article
                key={tenant.id}
                className="admin-card-soft grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--admin-title)]">
                    {tenant.studio_name}
                  </p>
                  <p className="admin-muted text-xs">
                    <a
                      href={`/${tenant.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      /{tenant.slug} ↗
                    </a>
                  </p>
                  <p className="admin-muted text-xs">theme: {tenant.site_theme}</p>
                  <p className="admin-muted text-xs">owner: {tenant.owner_user_id}</p>
                </div>

                <select
                  className="admin-input min-w-[140px]"
                  value={tenant.status}
                  onChange={(event) =>
                    void updateTenant(tenant.id, {
                      status: event.target.value as Tenant["status"],
                    })
                  }
                  disabled={isSavingTenant === tenant.id}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="suspended">suspended</option>
                </select>

                <select
                  className="admin-input min-w-[120px]"
                  value={tenant.plan_code}
                  onChange={(event) =>
                    void updateTenant(tenant.id, {
                      plan_code: event.target.value as Tenant["plan_code"],
                    })
                  }
                  disabled={isSavingTenant === tenant.id}
                >
                  <option value="free">free</option>
                  <option value="premium">premium</option>
                </select>
                <select
                  className="admin-input min-w-[140px]"
                  value={tenant.site_theme}
                  onChange={(event) =>
                    void updateTenant(tenant.id, {
                      site_theme: event.target.value as Tenant["site_theme"],
                    })
                  }
                  disabled={isSavingTenant === tenant.id}
                >
                  <option value="atelier">atelier</option>
                  <option value="mono">mono</option>
                  <option value="ink">ink</option>
                  <option value="akemi_brutalist">akemi_brutalist</option>
                </select>
                <button
                  type="button"
                  className="admin-button admin-button-danger"
                  onClick={() => void deleteTenant(tenant.id)}
                  disabled={isSavingTenant === tenant.id}
                >
                  Delete
                </button>
              </article>
            ))
          ) : (
            <p className="admin-muted text-sm">No artist tenants registered yet.</p>
          )}
        </div>
      </section>

      <section className="admin-card p-5">
        <p className="admin-chip">Global Integrations</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">Maintenance Switches</h2>
        <p className="admin-muted mt-2 text-sm leading-6">
          Enable or disable providers globally when maintenance is required.
        </p>

        <div className="mt-4 space-y-3">
          {integrations.map((integration) => (
            <article key={integration.provider} className="admin-card-soft p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  {integration.provider}
                </p>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={integration.is_enabled}
                    onChange={(event) =>
                      void updateIntegration(integration.provider, {
                        is_enabled: event.target.checked,
                        maintenance_message: integration.maintenance_message ?? "",
                      })
                    }
                    disabled={isSavingIntegration === integration.provider}
                  />
                  <span className="admin-muted">Enabled</span>
                </label>
              </div>
              {!integration.is_enabled ? (
                <p className="admin-helper mt-2" data-variant="warning">
                  Integration disabled globally.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {status ? (
        <p className="admin-validation" data-variant="success" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}
