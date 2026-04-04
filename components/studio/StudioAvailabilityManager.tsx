"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Availability = {
  mon: boolean; tue: boolean; wed: boolean; thu: boolean;
  fri: boolean; sat: boolean; sun: boolean;
  start_time: string; end_time: string; notes: string;
};

const DEFAULT: Availability = {
  mon: true, tue: true, wed: true, thu: true, fri: true,
  sat: false, sun: false, start_time: "10:00", end_time: "18:00", notes: "",
};

const DAYS: { key: keyof Availability; label: string }[] = [
  { key: "mon", label: "Mon" }, { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" }, { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" }, { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export function StudioAvailabilityManager() {
  const [avail, setAvail] = useState<Availability>(DEFAULT);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schemaPending, setSchemaPending] = useState(false);

  useEffect(() => {
    fetch("/api/studio/availability")
      .then((r) => r.json())
      .then((d) => setAvail({ ...DEFAULT, ...(d.availability ?? {}) }))
      .finally(() => setIsLoading(false));
  }, []);

  function toggle(key: keyof Availability) {
    setAvail((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setStatus("");
    setIsSaving(true);
    const res = await fetch("/api/studio/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avail),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 409) setSchemaPending(true);
      setStatus(data?.message ?? "Failed to save.");
    } else {
      setStatus("Availability saved.");
    }
    setIsSaving(false);
  }

  if (isLoading) return <AdminSectionSkeleton fields={2} cards={0} />;

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Availability</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Booking Availability</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Set which days and hours clients can request bookings. This is shown in your public booking form.
      </p>

      {schemaPending && (
        <div className="mt-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-accent-soft)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--admin-title)]">Database update required</p>
          <p className="admin-muted mt-1 text-xs leading-5">Run <code className="font-mono text-[var(--admin-accent)]">MVP_COMPLETION_PATCH.sql</code> in Supabase.</p>
        </div>
      )}

      <div className="mt-6">
        <p className="admin-muted mb-3 text-xs uppercase tracking-[0.14em]">Available days</p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(({ key, label }) => (
            <button key={key} type="button"
              onClick={() => toggle(key)}
              className={[
                "rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                avail[key]
                  ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
                  : "border-[var(--admin-border)] bg-[var(--admin-surface-strong)] text-[var(--admin-muted)]",
              ].join(" ")}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">From</label>
          <input type="time" className="admin-input" value={avail.start_time}
            onChange={(e) => setAvail((p) => ({ ...p, start_time: e.target.value }))} />
        </div>
        <div>
          <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Until</label>
          <input type="time" className="admin-input" value={avail.end_time}
            onChange={(e) => setAvail((p) => ({ ...p, end_time: e.target.value }))} />
        </div>
      </div>

      <div className="mt-4">
        <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Note for clients (optional)</label>
        <textarea className="admin-textarea min-h-[80px]"
          placeholder="e.g. Last-minute slots available on request. DM before booking."
          value={avail.notes}
          onChange={(e) => setAvail((p) => ({ ...p, notes: e.target.value }))} />
      </div>

      <div className="mt-4">
        <button type="button" onClick={handleSave} disabled={isSaving || schemaPending}
          className="admin-button admin-button-primary">{isSaving ? "Saving…" : "Save availability"}</button>
      </div>

      {status && (
        <p className="admin-validation mt-4"
          data-variant={status.includes("saved") ? "success" : "error"}
          aria-live="polite">{status}</p>
      )}
    </section>
  );
}
