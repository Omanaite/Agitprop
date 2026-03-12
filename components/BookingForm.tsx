"use client";

import { useState } from "react";

type BookingFormState = "idle" | "submitting" | "success" | "error";

// Client booking form that posts to the booking API route.
export function BookingForm() {
  const [state, setState] = useState<BookingFormState>("idle");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const errorMap = new Map(errors.map((error) => [error.path, error.message]));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors(error.errors ?? []);
        throw new Error(error.message || "Booking failed.");
      }

      setState("success");
      setMessage("Booking request sent. We will reply within 48h.");
      setErrors([]);
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "Unexpected error occurred."
      );
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-xs uppercase tracking-[0.2em]">
          Name
          <input
            className={`hard-border mt-1 w-full px-3 py-2 ${
              errorMap.get("name") ? "input-error" : ""
            }`}
            name="name"
            minLength={2}
            required
          />
        </label>
        {errorMap.get("name") ? (
          <p className="input-helper" data-variant="error">
            name: {errorMap.get("name")}
          </p>
        ) : null}
        <label className="text-xs uppercase tracking-[0.2em]">
          Email
          <input
            className={`hard-border mt-1 w-full px-3 py-2 ${
              errorMap.get("email") ? "input-error" : ""
            }`}
            name="email"
            type="email"
            required
          />
        </label>
        {errorMap.get("email") ? (
          <p className="input-helper" data-variant="error">
            email: {errorMap.get("email")}
          </p>
        ) : null}
        <label className="text-xs uppercase tracking-[0.2em]">
          Preferred Date
          <input
            className="hard-border mt-1 w-full px-3 py-2"
            name="preferredDate"
            type="date"
            required
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em]">
          Placement / Size
          <input
            className={`hard-border mt-1 w-full px-3 py-2 ${
              errorMap.get("placement") ? "input-error" : ""
            }`}
            name="placement"
            minLength={2}
            required
          />
        </label>
        {errorMap.get("placement") ? (
          <p className="input-helper" data-variant="error">
            placement: {errorMap.get("placement")}
          </p>
        ) : null}
        <label className="text-xs uppercase tracking-[0.2em]">
          Description
          <textarea
            className={`hard-border mt-1 min-h-[120px] w-full px-3 py-2 ${
              errorMap.get("description") ? "input-error" : ""
            }`}
            name="description"
            minLength={10}
            required
          />
        </label>
        {errorMap.get("description") ? (
          <p className="input-helper" data-variant="error">
            description: {errorMap.get("description")}
          </p>
        ) : null}
      </div>
      <button
        className="snap-transition theme-border theme-invert w-full px-4 py-3"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Submitting..." : "Request Session"}
      </button>
      {message ? (
        <p
          className="validation-box"
          data-variant={state === "error" ? "error" : "success"}
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
