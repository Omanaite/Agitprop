"use client";

import { useState } from "react";

type ContactFormState = "idle" | "submitting" | "success" | "error";

// Lightweight contact form that posts to the contact API route.
export function ContactForm() {
  const [state, setState] = useState<ContactFormState>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Message failed.");
      }

      setState("success");
      setMessage("Message sent. We will reply soon.");
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
      <label className="text-xs uppercase tracking-[0.2em]">
        Name
        <input className="hard-border mt-1 w-full px-3 py-2" name="name" />
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
        Message
        <textarea
          className="hard-border mt-1 min-h-[120px] w-full px-3 py-2"
          name="message"
          required
        />
      </label>
      <button
        className="snap-transition hard-border w-full bg-black px-4 py-3 text-white hover:bg-white hover:text-black"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Sending..." : "Send Message"}
      </button>
      {message ? (
        <p className="text-xs uppercase tracking-[0.2em]">{message}</p>
      ) : null}
    </form>
  );
}
