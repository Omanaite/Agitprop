"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Slot = {
  id: string;
  label: string;
  days: string[];
  from: string;
  until: string;
  capacity: number;
  note: string;
};

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_VALUES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const emptyDraft = (): Slot => ({
  id: crypto.randomUUID(),
  label: "",
  days: ["mon", "tue", "wed", "thu", "fri"],
  from: "10:00",
  until: "18:00",
  capacity: 1,
  note: "",
});

export function StudioAvailabilityManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [draft, setDraft] = useState<Slot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/studio/availability-slots")
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  function startAdd() {
    setDraft(emptyDraft());
    setIsEditing(false);
    setStatus("");
  }

  function startEdit(slot: Slot) {
    setDraft({ ...slot });
    setIsEditing(true);
    setStatus("");
  }

  function cancelDraft() {
    setDraft(null);
    setIsEditing(false);
  }

  function toggleDay(day: string) {
    if (!draft) return;
    setDraft((prev) => {
      if (!prev) return prev;
      const days = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return { ...prev, days };
    });
  }

  function commitDraft() {
    if (!draft) return;
    if (!draft.label.trim()) { setStatus("El slot necesita un nombre."); return; }
    if (!draft.days.length) { setStatus("Selecciona al menos un día."); return; }
    if (draft.capacity < 1) { setStatus("La capacidad debe ser al menos 1."); return; }
    setStatus("");
    if (isEditing) {
      setSlots((prev) => prev.map((s) => s.id === draft.id ? draft : s));
    } else {
      setSlots((prev) => [...prev, draft]);
    }
    setDraft(null);
    setIsEditing(false);
  }

  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    setStatus("");
    setIsSaving(true);
    const res = await fetch("/api/studio/availability-slots", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setStatus(data?.message ?? "Error al guardar.");
    } else {
      setStatus("Disponibilidad guardada.");
    }
    setIsSaving(false);
  }

  if (isLoading) return <AdminSectionSkeleton fields={2} cards={0} />;

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Availability</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Disponibilidad de agenda</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Crea múltiples bloques de disponibilidad. Cada bloque tiene días, horario, capacidad y nombre.
        Úsalo para workshops (N personas) o sesiones individuales (1 persona). Cuando se alcanza la
        capacidad, el slot se deshabilita automáticamente en el formulario público.
      </p>

      {/* Slot list */}
      {slots.length > 0 && (
        <ul className="mt-6 grid gap-3">
          {slots.map((slot) => (
            <li key={slot.id} className="admin-card-soft flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--admin-title)]">{slot.label}</span>
                  <span className="admin-chip py-0.5 px-2 text-xs">cap. {slot.capacity}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {DAY_VALUES.map((d, i) => (
                    <span key={d} className={[
                      "rounded px-1.5 py-0.5 text-xs font-medium",
                      slot.days.includes(d)
                        ? "bg-[var(--admin-accent)] text-white"
                        : "bg-[var(--admin-surface-strong)] text-[var(--admin-muted)]",
                    ].join(" ")}>
                      {DAY_OPTIONS[i]}
                    </span>
                  ))}
                </div>
                <p className="admin-muted mt-1 text-xs">{slot.from} – {slot.until}{slot.note ? ` · ${slot.note}` : ""}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="admin-button" onClick={() => startEdit(slot)}>Editar</button>
                <button className="admin-button admin-button-danger" onClick={() => removeSlot(slot.id)}>Quitar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {slots.length === 0 && !draft && (
        <div className="admin-card-soft mt-6 p-6 text-center">
          <p className="text-sm font-semibold text-[var(--admin-title)]">Sin bloques de disponibilidad</p>
          <p className="admin-muted mt-1 text-xs leading-5">Agrega un bloque para empezar.</p>
        </div>
      )}

      {/* Draft editor */}
      {draft && (
        <div className="mt-6 admin-card-soft p-5 grid gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--admin-title)]">
            {isEditing ? "Editar bloque" : "Nuevo bloque"}
          </h3>

          <div>
            <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Nombre del bloque</label>
            <input
              className="admin-input"
              placeholder="Ej: Sesión individual, Workshop linework"
              value={draft.label}
              onChange={(e) => setDraft((p) => p ? { ...p, label: e.target.value } : p)}
            />
          </div>

          <div>
            <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Días disponibles</label>
            <div className="flex flex-wrap gap-2">
              {DAY_VALUES.map((d, i) => (
                <button key={d} type="button"
                  onClick={() => toggleDay(d)}
                  className={[
                    "rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                    draft.days.includes(d)
                      ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
                      : "border-[var(--admin-border)] bg-[var(--admin-surface-strong)] text-[var(--admin-muted)]",
                  ].join(" ")}>
                  {DAY_OPTIONS[i]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Desde</label>
              <input type="time" className="admin-input" value={draft.from}
                onChange={(e) => setDraft((p) => p ? { ...p, from: e.target.value } : p)} />
            </div>
            <div>
              <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Hasta</label>
              <input type="time" className="admin-input" value={draft.until}
                onChange={(e) => setDraft((p) => p ? { ...p, until: e.target.value } : p)} />
            </div>
          </div>

          <div>
            <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Capacidad (personas)</label>
            <input type="number" className="admin-input" min={1} max={500} value={draft.capacity}
              onChange={(e) => setDraft((p) => p ? { ...p, capacity: Number(e.target.value) } : p)} />
            <p className="admin-helper mt-1">1 = sesión individual · N = workshop o grupo</p>
          </div>

          <div>
            <label className="admin-muted mb-2 block text-xs uppercase tracking-[0.14em]">Nota para clientes (opcional)</label>
            <input className="admin-input" placeholder="Ej: Incluye boceto. Confirmar con depósito."
              value={draft.note}
              onChange={(e) => setDraft((p) => p ? { ...p, note: e.target.value } : p)} />
          </div>

          {status && (
            <p className="admin-validation" data-variant="error" aria-live="polite">{status}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" className="admin-button admin-button-primary" onClick={commitDraft}>
              {isEditing ? "Actualizar bloque" : "Agregar bloque"}
            </button>
            <button type="button" className="admin-button admin-button-ghost" onClick={cancelDraft}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {!draft && (
          <button type="button" className="admin-button" onClick={startAdd}>+ Agregar bloque</button>
        )}
        <button type="button" className="admin-button admin-button-primary" onClick={handleSave}
          disabled={isSaving || slots.length === 0}>
          {isSaving ? "Guardando…" : "Guardar disponibilidad"}
        </button>
      </div>

      {!draft && status && (
        <p className="admin-validation mt-4"
          data-variant={status.includes("guardada") ? "success" : "error"}
          aria-live="polite">{status}</p>
      )}
    </section>
  );
}
