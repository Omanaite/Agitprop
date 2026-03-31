export function PlatformAdminShell() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <section className="admin-card p-5">
        <p className="admin-chip">Tenants</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">Artist Sites</h2>
        <p className="admin-muted mt-3 text-sm leading-6">
          Activate, deactivate, edit, and retire artist sites with full audit
          trail support.
        </p>
      </section>

      <section className="admin-card p-5">
        <p className="admin-chip">Roles</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">Permissions</h2>
        <p className="admin-muted mt-3 text-sm leading-6">
          Assign platform and artist roles, then apply feature bundles by plan.
        </p>
      </section>

      <section className="admin-card p-5">
        <p className="admin-chip">Integrations</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">
          Global Controls
        </h2>
        <p className="admin-muted mt-3 text-sm leading-6">
          Enable or pause provider integrations globally during maintenance
          windows.
        </p>
      </section>

      <section className="admin-card p-5 md:col-span-2 xl:col-span-3">
        <p className="admin-chip">Boundary</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">
          Platform Scope
        </h2>
        <p className="admin-muted mt-3 text-sm leading-6">
          Content modules (homepage, galleries, pieces, posts) are intentionally
          moved to the artist workspace and are not exposed in platform admin.
        </p>
      </section>
    </div>
  );
}

