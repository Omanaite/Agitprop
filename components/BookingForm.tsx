"use client";

import { useState } from "react";

type BookingFormState = "idle" | "submitting" | "success" | "error";

// Client booking form that posts to the booking API route.
export function BookingForm() {
  const [state, setState] = useState<BookingFormState>("idle");
  const [message, setMessage] = useState<string>("");

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
        throw new Error(error.message || "Booking failed.");
      }

      setState("success");
      setMessage("Booking request sent. We will reply within 48h.");
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
            className="hard-border mt-1 w-full px-3 py-2"
            name="name"
            required
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em]">
          Email
          <input
            className="hard-border mt-1 w-full px-3 py-2"
            name="email"
            type="email"
            required
          />
        </label>
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
            className="hard-border mt-1 w-full px-3 py-2"
            name="placement"
            required
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em]">
          Description
          <textarea
            className="hard-border mt-1 min-h-[120px] w-full px-3 py-2"
            name="description"
            required
          />
        </label>
      </div>
      <button
        className="snap-transition hard-border w-full bg-black px-4 py-3 text-white hover:bg-white hover:text-black"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Submitting..." : "Request Session"}
      </button>
      {message ? (
        <p className="text-xs uppercase tracking-[0.2em]">{message}</p>
      ) : null}
    </form>
  );
}
