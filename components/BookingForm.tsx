"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BookingFormState = "idle" | "submitting" | "success" | "error";

type SlotWithCapacity = {
  id: string; date: string; from: string; until: string;
  capacity: number; label?: string; note?: string;
  booked: number; available: number;
};

function formatDateLabel(ymd: string, locale = "en") {
  const date = new Date(ymd + "T12:00:00");
  return date.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

type BookingFormProps = {
  copy: {
    name: string; email: string; preferredDate: string;
    placement: string; description: string;
    submitIdle: string; submitBusy: string; success: string;
    errorFallback: string; unexpected: string;
    availableDates: string; noAvailableDates: string;
    selectTime: string; noTimesForDay: string; loading: string;
    slotFull: string; slotOccupied: string;
    spotsAvailable: string; spotAvailable: string;
    selectDateFirst: string; selectSlotFirst: string;
  };
  tenantSlug?: string;
  demoMode?: boolean;
  locale?: string;
};

export function BookingForm({ copy, tenantSlug, demoMode, locale = "en" }: BookingFormProps) {
  const [formState, setFormState] = useState<BookingFormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);

  // Available dates (no slots yet)
  const [availableDates, setAvailableDates] = useState<string[] | null>(null);
  const [loadingDates, setLoadingDates] = useState(false);

  // Selected date + its slots
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<SlotWithCapacity[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  const errorMap = new Map(errors.map((e) => [e.path, e.message]));
  const today = new Date().toISOString().split("T")[0];

  // Fetch available dates on mount
  useEffect(() => {
    if (!tenantSlug) return;
    setLoadingDates(true);
    fetch(`/api/public/availability-slots?slug=${encodeURIComponent(tenantSlug)}`)
      .then((r) => r.json())
      .then((d) => setAvailableDates(d.dates ?? null))
      .catch(() => setAvailableDates(null))
      .finally(() => setLoadingDates(false));
  }, [tenantSlug]);

  // Fetch slots when date selected
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

  const selectedSlot = slots?.find((s) => s.id === selectedSlotId) ?? null;
  const hasSlotSystem = availableDates !== null;
  // If slot system active, require slot selection when slots exist for the day
  const slotsRequired = hasSlotSystem && slots !== null && slots.length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (slotsRequired && !selectedSlotId) {
      setErrors([{ path: "slot", message: copy.selectSlotFirst }]);
      setFormState("error");
      setMessage(copy.selectSlotFirst);
      return;
    }

    if (demoMode) {
      setFormState("success");
      setMessage("This is a live demo — no booking was saved. Register to accept real bookings.");
      form.reset(); setSelectedDate(""); setSlots(null); setSelectedSlotId("");
      return;
    }

    setFormState("submitting"); setMessage(""); setErrors([]);

    const formData = new FormData(form);
    const payload: Record<string, string> = Object.fromEntries(
      Array.from(formData.entries()).map(([k, v]) => [k, String(v)])
    );
    if (tenantSlug) payload.tenantSlug = tenantSlug;
    if (selectedSlot) {
      payload.slot_id = selectedSlot.id;
      payload.slot_label = selectedSlot.label
        ? `${selectedSlot.label} (${selectedSlot.from}–${selectedSlot.until})`
        : `${selectedSlot.from}–${selectedSlot.until}`;
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
      setFormState("success");
      setMessage(copy.success);
      setErrors([]);
      form.reset();
      setSelectedDate(""); setSlots(null); setSelectedSlotId("");
    } catch (error) {
      setFormState("error");
      setMessage(error instanceof Error ? error.message : copy.unexpected);
    }
  }

  return (
    <div className="space-y-4">

      {/* Available dates list — shown when artist uses slot system */}
      {hasSlotSystem && (
        <div className="theme-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-3">{copy.availableDates}</p>
          {loadingDates && <p className="text-xs text-[var(--muted)]">{copy.loading}</p>}
          {!loadingDates && availableDates && availableDates.length === 0 && (
            <p className="text-xs text-[var(--muted)]">{copy.noAvailableDates}</p>
          )}
          {!loadingDates && availableDates && availableDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableDates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(selectedDate === d ? "" : d)}
                  className={[
                    "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-[var(--transition-speed)] cubic-bezier(var(--ease-out-expo))",
                    selectedDate === d
                      ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]"
                      : "theme-border hover:bg-[var(--fg)] hover:text-[var(--bg)]",
                  ].join(" ")}
                >
                  {formatDateLabel(d, locale)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slots for selected date */}
      {selectedDate && (
        <div>
          {loadingSlots && <p className="text-xs text-[var(--muted)]">{copy.loading}</p>}
          {!loadingSlots && slots !== null && slots.length === 0 && (
            <p className="text-xs text-[var(--muted)]">{copy.noTimesForDay}</p>
          )}
          {!loadingSlots && slots && slots.length > 0 && (
            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{copy.selectTime} — {formatDateLabel(selectedDate)}</p>
              {slots.map((slot) => {
                const full = slot.available <= 0;
                const selected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={full}
                    onClick={() => { setSelectedSlotId(slot.id); setErrors([]); }}
                    className={[
                      "text-left rounded-xl border px-4 py-3 text-sm transition-all duration-[var(--transition-speed)] cubic-bezier(var(--ease-out-expo))",
                      full
                        ? "text-[var(--muted)] cursor-not-allowed theme-border grayscale"
                        : selected
                          ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]"
                          : "theme-border hover:bg-[var(--fg)] hover:text-[var(--bg)]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold">{slot.from} – {slot.until}</span>
                      {slot.label && <span className="text-[var(--muted)] text-xs">{slot.label}</span>}
                      {slot.capacity > 1 && (
                        <span className={["text-xs", full ? "" : "text-[var(--muted)]"].join(" ")}>
                          {full ? copy.slotFull : `${slot.available} ${slot.available === 1 ? copy.spotAvailable : copy.spotsAvailable}`}
                        </span>
                      )}
                      {full && slot.capacity === 1 && <span className="text-xs">{copy.slotOccupied}</span>}
                    </div>
                    {slot.note && <p className="text-xs text-[var(--muted)] mt-1">{slot.note}</p>}
                  </button>
                );
              })}
              {errorMap.get("slot") && (
                <p className="input-helper" data-variant="error">{errorMap.get("slot")}</p>
              )}
            </div>
          )}
        </div>
      )}

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.name}
            <input
              className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("name") ? "input-error" : ""}`}
              name="name" minLength={2} required
              aria-invalid={errorMap.has("name") || undefined}
              aria-describedby={errorMap.has("name") ? "err-name" : undefined}
            />
          </label>
          {errorMap.get("name") && <p id="err-name" className="input-helper" data-variant="error" role="alert">{errorMap.get("name")}</p>}

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.email}
            <input
              className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("email") ? "input-error" : ""}`}
              name="email" type="email" required
              aria-invalid={errorMap.has("email") || undefined}
              aria-describedby={errorMap.has("email") ? "err-email" : undefined}
            />
          </label>
          {errorMap.get("email") && <p id="err-email" className="input-helper" data-variant="error" role="alert">{errorMap.get("email")}</p>}

          {/* Date input — hidden if using slot system (date comes from slot selection) */}
          {!hasSlotSystem && (
            <>
              <label className="text-xs uppercase tracking-[0.2em]">
                {copy.preferredDate}
                <input
                  className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("preferredDate") ? "input-error" : ""}`}
                  name="preferredDate" type="date" min={today} required
                />
              </label>
              {errorMap.get("preferredDate") && (
                <p className="input-helper" data-variant="error">{errorMap.get("preferredDate")}</p>
              )}
            </>
          )}
          {/* When using slot system, date comes from selectedDate */}
          {hasSlotSystem && (
            <input type="hidden" name="preferredDate" value={selectedDate} />
          )}

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.placement}
            <input
              className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("placement") ? "input-error" : ""}`}
              name="placement" minLength={2} required
              aria-invalid={errorMap.has("placement") || undefined}
              aria-describedby={errorMap.has("placement") ? "err-placement" : undefined}
            />
          </label>
          {errorMap.get("placement") && <p id="err-placement" className="input-helper" data-variant="error" role="alert">{errorMap.get("placement")}</p>}

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.description}
            <textarea
              className={`hard-border mt-1 min-h-[120px] w-full px-3 py-2 ${errorMap.get("description") ? "input-error" : ""}`}
              name="description" minLength={10} required
              aria-invalid={errorMap.has("description") || undefined}
              aria-describedby={errorMap.has("description") ? "err-description" : undefined}
            />
          </label>
          <label className="hidden" aria-hidden="true">
            Website <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          </label>
          {errorMap.get("description") && <p id="err-description" className="input-helper" data-variant="error" role="alert">{errorMap.get("description")}</p>}
        </div>

        <button
          className="snap-transition theme-border theme-invert w-full px-4 py-3 transition-all duration-[var(--transition-speed)] cubic-bezier(var(--ease-out-expo))"
          type="submit"
          disabled={formState === "submitting" || (hasSlotSystem && !selectedDate)}
          title={hasSlotSystem && !selectedDate ? copy.selectDateFirst : undefined}
        >
          {formState === "submitting" ? copy.submitBusy : copy.submitIdle}
        </button>

        <AnimatePresence>
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="validation-box"
              data-variant={formState === "error" ? "error" : "success"}
              aria-live="polite"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
