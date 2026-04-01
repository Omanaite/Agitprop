"use client";

import { useState } from "react";

export function ResendConfirmationForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus("sent");
        setMessage(data?.message ?? "Confirmation email sent. Check your inbox.");
      } else {
        setStatus("error");
        setMessage(data?.message ?? "Could not resend. Try again later.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <p className="admin-validation mt-4" data-variant="success" aria-live="polite">
        {message}
      </p>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[var(--admin-border)] p-4">
      <p className="text-sm font-semibold text-[var(--admin-title)]">
        Resend confirmation email
      </p>
      <p className="admin-muted mt-1 text-xs leading-5">
        Enter your email to receive a new confirmation link.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          className="admin-input flex-1 text-sm"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="admin-button admin-button-primary shrink-0 text-sm"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Send"}
        </button>
      </form>
      {status === "error" && message ? (
        <p className="admin-validation mt-2 text-xs" data-variant="error" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
