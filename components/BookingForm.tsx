"use client";

import { useEffect, useState } from "react";

type BookingFormState = "idle" | "submitting" | "success" | "error";

type Availability = {
  mon: boolean; tue: boolean; wed: boolean; thu: boolean;
  fri: boolean; sat: boolean; sun: boolean;
  start_time: string; end_time: string; notes: string;
};

const DAY_INDEX: Record<number, keyof Availability> = {
  0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type BookingFormProps = {
  copy: {
    name: string; email: string; preferredDate: string;
    placement: string; description: string;
    submitIdle: string; submitBusy: string; success: string;
    errorFallback: string; unexpected: string;
  };
  tenantSlug?: string;
};

export function BookingForm({ copy, tenantSlug }: BookingFormProps) {
  const [state, setState] = useState<BookingFormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const [avail, setAvail] = useState<Availability | null>(null);
  const errorMap = new Map(errors.map((e) => [e.path, e.message]));

  useEffect(() => {
    if (!tenantSlug) return;
    fetch(`/api/public/availability?slug=${encodeURIComponent(tenantSlug)}`)
      .then((r) => r.json())
      .then((d) => setAvail(d.availability ?? null))
      .catch(() => null);
  }, [tenantSlug]);

  const availableDays = avail
    ? [0, 1, 2, 3, 4, 5, 6].filter((d) => avail[DAY_INDEX[d]])
    : null;

  const today = new Date().toISOString().split("T")[0];

  function isDateDisabled(dateStr: string) {
    if (!availableDays) return false;
    const d = new Date(dateStr + "T12:00:00");
    return !availableDays.includes(d.getDay());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const dateVal = (form.elements.namedItem("preferredDate") as HTMLInputElement)?.value;
    if (dateVal && isDateDisabled(dateVal)) {
      setErrors([{ path: "preferredDate", message: "That day is not available. Choose a different date." }]);
      setState("error");
      setMessage("Please select an available date.");
      return;
    }
    setState("submitting");
    setMessage("");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (tenantSlug) Object.assign(payload, { tenantSlug });
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
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : copy.unexpected);
    }
  }

  return (
    <div className="space-y-4">
      {avail && availableDays && availableDays.length > 0 && (
        <div className="theme-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-2">Available days</p>
          <div className="flex flex-wrap gap-2">
            {[0,1,2,3,4,5,6].map((d) => (
              <span key={d} className={[
                "rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]",
                availableDays.includes(d) ? "bg-[var(--fg)] text-[var(--bg)]" : "opacity-25",
              ].join(" ")}>{DAY_NAMES[d]}</span>
            ))}
          </div>
          <p className="mt-2 text-xs opacity-60">
            {avail.start_time} – {avail.end_time}
            {avail.notes ? ` · ${avail.notes}` : ""}
          </p>
        </div>
      )}

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

          <label className="text-xs uppercase tracking-[0.2em]">
            {copy.preferredDate}
            <input className={`hard-border mt-1 w-full px-3 py-2 ${errorMap.get("preferredDate") ? "input-error" : ""}`}
              name="preferredDate" type="date" min={today} required />
          </label>
          {errorMap.get("preferredDate") && <p className="input-helper" data-variant="error">{errorMap.get("preferredDate")}</p>}

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
