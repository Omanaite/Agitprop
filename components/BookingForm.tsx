"use client";

import { useEffect, useState } from "react";

type BookingFormState = "idle" | "submitting" | "success" | "error";

type SlotWithCapacity = {
  id: string;
  label: string;
  days: string[];
  from: string;
  until: string;
  capacity: number;
  note: string;
  booked: number;
  available: number;
};

const DAY_KEY: Record<number, string> = {
  0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat",
};

type BookingFormProps = {
  copy: {
    name: string; email: string; preferredDate: string;
    placement: string; description: string;
    submitIdle: string; submitBusy: string; success: string;
    errorFallback: string; unexpected: string;
  };
  tenantSlug?: string;
  demoMode?: boolean;
};

export function BookingForm({ copy, tenantSlug, demoMode }: BookingFormProps) {
  const [state, setState] = useState<BookingFormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<SlotWithCapacity[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const errorMap = new Map(errors.map((e) => [e.path, e.message]));

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!tenantSlug || !selectedDate) { setSlots(null); setSelectedSlotId(""); return; }
    setLoadingSlots(true);
    setSlots(null);
    setSelectedSlotId("");
    fetch(`/api/public/availability-slots?slug=${encodeURIComponent(tenantSlug)}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [tenantSlug, selectedDate]);

  const slotsForDay = slots?.filter((s) => {
    if (!selectedDate) return false;
    const dow = new Date(selectedDate + "T12:00:00").getDay();
    return s.days.includes(DAY_KEY[dow]);
  }) ?? null;

  const selectedSlot = slotsForDay?.find((s) => s.id === selectedSlotId) ?? null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // If there are slots configured, a slot selection is required
    if (slotsForDay && slotsForDay.length > 0 && !selectedSlotId) {
      setErrors([{ path: "slot", message: "Selecciona un horario disponible." }]);
      setState("error");
      setMessage("Selecciona un horario para continuar.");
      return;
    }

    if (demoMode) {
      setState("success");
      setMessage("This is a live demo — no booking was saved. Register to accept real bookings.");
      form.reset();
      setSelectedDate("");
      setSlots(null);
      setSelectedSlotId("");
      return;
    }

    setState("submitting");
    setMessage("");
    setErrors([]);

    const formData = new FormData(form);
    const payload: Record<string, string> = Object.fromEntries(
      Array.from(formData.entries()).map(([k, v]) => [k, String(v)])
    );
    if (tenantSlug) payload.tenantSlug = tenantSlug;
    if (selectedSlot) {
      payload.slot_id = selectedSlot.id;
      payload.slot_label = selectedSlot.label;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrors(error.errors ?? []);
        throw new Error(error.message || copy.errorFallback);
      }
      setState("success");
      setMessage(copy.success);
      setErrors([]);
      form.reset();
      setSelectedDate("");
      setSlots(null);
      setSelectedSlotId("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : copy.unexpected);
    }
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.name}
            <input className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("name") ? "input-error" : ""}`}
              name="name" minLength={2} required />
          </label>
          {errorMap.get("name") && <p className="input-helper" data-variant="error">name: {errorMap.get("name")}</p>}

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.email}
            <input className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("email") ? "input-error" : ""}`}
              name="email" type="email" required />
          </label>
          {errorMap.get("email") && <p className="input-helper" data-variant="error">email: {errorMap.get("email")}</p>}

          {/* Date picker */}
          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.preferredDate}
            <input
              className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("preferredDate") ? "input-error" : ""}`}
              name="preferredDate" type="date" min={today} required
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setErrors([]); setState("idle"); }}
            />
          </label>
          {errorMap.get("preferredDate") && <p className="input-helper" data-variant="error">{errorMap.get("preferredDate")}</p>}

          {/* Slot selector */}
          {selectedDate && (
            <div>
              {loadingSlots && (
                <p className="text-xs opacity-60 mt-1">Cargando horarios…</p>
              )}
              {!loadingSlots && slotsForDay !== null && slotsForDay.length === 0 && (
                <div className="theme-border rounded-xl p-4 mt-1">
                  <p className="text-xs opacity-60">Sin disponibilidad para este día.</p>
                </div>
              )}
              {!loadingSlots && slotsForDay && slotsForDay.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs uppercase tracking-[0.2em] mb-2">Horario disponible</p>
                  <div className="grid gap-2">
                    {slotsForDay.map((slot) => {
                      const full = slot.available <= 0;
                      const selected = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={full}
                          onClick={() => { setSelectedSlotId(slot.id); setErrors([]); }}
                          className={[
                            "text-left rounded-xl border px-4 py-3 text-sm transition-all",
                            full
                              ? "opacity-40 cursor-not-allowed border-current"
                              : selected
                                ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]"
                                : "theme-border hover:bg-[var(--fg)] hover:text-[var(--bg)]",
                          ].join(" ")}
                        >
                          <span className="font-semibold">{slot.label}</span>
                          <span className="ml-2 opacity-70 text-xs">{slot.from} – {slot.until}</span>
                          {slot.capacity > 1 && (
                            <span className={["ml-2 text-xs", full ? "" : selected ? "opacity-70" : "opacity-50"].join(" ")}>
                              {full ? "Completo" : `${slot.available} lugar${slot.available !== 1 ? "es" : ""}`}
                            </span>
                          )}
                          {full && slot.capacity === 1 && (
                            <span className="ml-2 text-xs">Ocupado</span>
                          )}
                          {slot.note && <span className="block text-xs opacity-50 mt-0.5">{slot.note}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {errorMap.get("slot") && <p className="input-helper mt-2" data-variant="error">{errorMap.get("slot")}</p>}
                </div>
              )}
            </div>
          )}

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.placement}
            <input className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("placement") ? "input-error" : ""}`}
              name="placement" minLength={2} required />
          </label>
          {errorMap.get("placement") && <p className="input-helper" data-variant="error">placement: {errorMap.get("placement")}</p>}

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.description}
            <textarea className={`hard-border mt-1 min-h-[120px] w-full px-3 py-2 ${errorMap.get("description") ? "input-error" : ""}`}
              name="description" minLength={10} required />
          </label>
          <label className="hidden" aria-hidden="true">
            Website <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          </label>
          {errorMap.get("description") && <p className="input-helper" data-variant="error">description: {errorMap.get("description")}</p>}
        </div>

        <button className="snap-transition theme-border theme-invert w-full px-4 py-3"
          type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? copy.submitBusy : copy.submitIdle}
        </button>

        {message && (
          <p className="validation-box" data-variant={state === "error" ? "error" : "success"} aria-live="polite">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
