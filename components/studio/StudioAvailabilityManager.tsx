"use client";

import { useEffect, useState } from "react";
import { AdminSectionSkeleton } from "@/components/admin/AdminSectionSkeleton";

type Slot = {
  id: string;
  date: string;   // YYYY-MM-DD
  from: string;
  until: string;
  capacity: number;
  label: string;
  note: string;
};

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function newSlot(date: string): Slot {
  return { id: crypto.randomUUID(), date, from: "10:00", until: "18:00", capacity: 1, label: "", note: "" };
}

function formatDateLabel(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function StudioAvailabilityManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Draft editor
  const [draft, setDraft] = useState<Slot | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  useEffect(() => {
    fetch("/api/studio/availability-slots")
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  // Calendar helpers
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayYMD = toYMD(today.getFullYear(), today.getMonth(), today.getDate());

  const slotsByDate = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    acc[s.date] = acc[s.date] ? [...acc[s.date], s] : [s];
    return acc;
  }, {});

  const selectedSlots = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDate(null);
  }

  function selectDate(ymd: string) {
    if (ymd < todayYMD) return; // past dates ignored
    setSelectedDate(ymd === selectedDate ? null : ymd);
    setDraft(null);
    setIsEditingDraft(false);
    setStatus("");
  }

  function startAddSlot() {
    if (!selectedDate) return;
    setDraft(newSlot(selectedDate));
    setIsEditingDraft(false);
    setStatus("");
  }

  function startEditSlot(slot: Slot) {
    setDraft({ ...slot });
    setIsEditingDraft(true);
    setStatus("");
  }

  function cancelDraft() {
    setDraft(null);
    setIsEditingDraft(false);
  }

  function commitDraft() {
    if (!draft) return;
    if (draft.from >= draft.until) { setStatus("La hora de inicio debe ser anterior a la de fin."); return; }
    setStatus("");
    if (isEditingDraft) {
      setSlots(prev => prev.map(s => s.id === draft.id ? draft : s));
    } else {
      setSlots(prev => [...prev, draft]);
    }
    setDraft(null);
    setIsEditingDraft(false);
  }

  function removeSlot(id: string) {
    setSlots(prev => prev.filter(s => s.id !== id));
    if (draft?.id === id) { setDraft(null); setIsEditingDraft(false); }
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
    setStatus(res.ok ? "Disponibilidad guardada." : (data?.message ?? "Error al guardar."));
    setIsSaving(false);
  }

  if (isLoading) return <AdminSectionSkeleton fields={2} cards={0} />;

  // Group all slots by date for the upcoming list
  const upcomingDates = [...new Set(slots.map(s => s.date))].sort();

  return (
    <section className="admin-card p-6 md:p-7">
      <p className="admin-chip">Availability</p>
      <h2 className="admin-title mt-4 text-2xl font-semibold">Agenda de disponibilidad</h2>
      <p className="admin-muted mt-2 text-sm leading-6">
        Selecciona un día en el calendario y agrega los turnos disponibles para ese día.
        Cada turno tiene horario, capacidad y nombre opcional.
      </p>

      {/* Calendar */}
      <div className="mt-6 admin-card-soft p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button type="button" className="admin-button px-3 py-1 text-sm" onClick={prevMonth}>‹</button>
          <span className="text-sm font-semibold text-[var(--admin-title)] uppercase tracking-[0.12em]">
            {MONTHS[calMonth]} {calYear}
          </span>
          <button type="button" className="admin-button px-3 py-1 text-sm" onClick={nextMonth}>›</button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] uppercase tracking-[0.1em] opacity-50 py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const ymd = toYMD(calYear, calMonth, day);
            const isPast = ymd < todayYMD;
            const isToday = ymd === todayYMD;
            const isSelected = ymd === selectedDate;
            const slotCount = slotsByDate[ymd]?.length ?? 0;

            return (
              <button
                key={ymd}
                type="button"
                disabled={isPast}
                onClick={() => selectDate(ymd)}
                className={[
                  "relative flex flex-col items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-all",
                  isPast ? "opacity-25 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--admin-surface-strong)]",
                  isSelected ? "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent)]" : "",
                  isToday && !isSelected ? "ring-1 ring-[var(--admin-accent)]" : "",
                ].join(" ")}
              >
                {day}
                {slotCount > 0 && (
                  <span className={[
                    "mt-0.5 text-[9px] font-bold leading-none",
                    isSelected ? "text-white/80" : "text-[var(--admin-accent)]",
                  ].join(" ")}>
                    {slotCount} slot{slotCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date panel */}
      {selectedDate && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--admin-title)]">
              {formatDateLabel(selectedDate)}
            </h3>
            <button type="button" className="admin-button text-xs" onClick={startAddSlot}>
              + Agregar turno
            </button>
          </div>

          {selectedSlots.length === 0 && !draft && (
            <p className="admin-muted mt-2 text-xs">Sin turnos para este día. Agrega uno arriba.</p>
          )}

          <ul className="mt-3 grid gap-2">
            {selectedSlots
              .sort((a, b) => a.from.localeCompare(b.from))
              .map(slot => (
                <li key={slot.id} className="admin-card-soft flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <span className="text-sm font-semibold text-[var(--admin-title)]">
                      {slot.from} – {slot.until}
                    </span>
                    {slot.label && (
                      <span className="ml-2 text-xs text-[var(--admin-muted)]">{slot.label}</span>
                    )}
                    <span className="ml-2 admin-chip py-0 text-[10px]">cap. {slot.capacity}</span>
                    {slot.note && <p className="mt-0.5 text-xs opacity-50">{slot.note}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="admin-button text-xs" onClick={() => startEditSlot(slot)}>Editar</button>
                    <button className="admin-button admin-button-danger text-xs" onClick={() => removeSlot(slot.id)}>Quitar</button>
                  </div>
                </li>
              ))}
          </ul>

          {/* Draft editor */}
          {draft && draft.date === selectedDate && (
            <div className="mt-3 admin-card-soft p-4 grid gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-title)]">
                {isEditingDraft ? "Editar turno" : "Nuevo turno"}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-muted mb-1 block text-xs uppercase tracking-[0.12em]">Desde</label>
                  <input type="time" className="admin-input" value={draft.from}
                    onChange={e => setDraft(p => p ? { ...p, from: e.target.value } : p)} />
                </div>
                <div>
                  <label className="admin-muted mb-1 block text-xs uppercase tracking-[0.12em]">Hasta</label>
                  <input type="time" className="admin-input" value={draft.until}
                    onChange={e => setDraft(p => p ? { ...p, until: e.target.value } : p)} />
                </div>
              </div>

              <div>
                <label className="admin-muted mb-1 block text-xs uppercase tracking-[0.12em]">Capacidad (personas)</label>
                <input type="number" className="admin-input" min={1} max={500} value={draft.capacity}
                  onChange={e => setDraft(p => p ? { ...p, capacity: Number(e.target.value) } : p)} />
                <p className="admin-helper mt-0.5">1 = solo una persona · N = workshop / grupo</p>
              </div>

              <div>
                <label className="admin-muted mb-1 block text-xs uppercase tracking-[0.12em]">Nombre del turno (opcional)</label>
                <input className="admin-input" placeholder="Ej: Sesión individual, Workshop linework"
                  value={draft.label}
                  onChange={e => setDraft(p => p ? { ...p, label: e.target.value } : p)} />
              </div>

              <div>
                <label className="admin-muted mb-1 block text-xs uppercase tracking-[0.12em]">Nota para clientes (opcional)</label>
                <input className="admin-input" placeholder="Ej: Incluye boceto, confirmar con depósito"
                  value={draft.note}
                  onChange={e => setDraft(p => p ? { ...p, note: e.target.value } : p)} />
              </div>

              {status && <p className="admin-validation" data-variant="error">{status}</p>}

              <div className="flex gap-2">
                <button type="button" className="admin-button admin-button-primary text-xs" onClick={commitDraft}>
                  {isEditingDraft ? "Actualizar" : "Agregar turno"}
                </button>
                <button type="button" className="admin-button admin-button-ghost text-xs" onClick={cancelDraft}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upcoming slots summary */}
      {upcomingDates.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-title)] mb-3">
            Próximos turnos ({slots.length} total)
          </h3>
          <ul className="grid gap-2">
            {upcomingDates.map(date => (
              <li key={date}>
                <button
                  type="button"
                  className="w-full text-left admin-card-soft px-4 py-2 hover:bg-[var(--admin-surface-strong)] transition-colors"
                  onClick={() => {
                    const [y, m, d] = date.split("-").map(Number);
                    setCalYear(y); setCalMonth(m - 1); setSelectedDate(date); setDraft(null);
                  }}
                >
                  <span className="text-xs font-semibold text-[var(--admin-title)]">{formatDateLabel(date)}</span>
                  <span className="ml-3 admin-muted text-xs">
                    {slotsByDate[date].sort((a, b) => a.from.localeCompare(b.from)).map(s =>
                      `${s.from}–${s.until}${s.capacity > 1 ? ` (${s.capacity}p)` : ""}`
                    ).join(" · ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Save button */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="admin-button admin-button-primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Guardando…" : "Guardar disponibilidad"}
        </button>
        {!status.includes("Error") && status && (
          <p className="admin-validation" data-variant="success" aria-live="polite">{status}</p>
        )}
        {status.includes("Error") && (
          <p className="admin-validation" data-variant="error" aria-live="polite">{status}</p>
        )}
      </div>
    </section>
  );
}
