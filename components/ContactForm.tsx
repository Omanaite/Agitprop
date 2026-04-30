"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ContactFormState = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  copy: {
    name: string;
    email: string;
    message: string;
    submitIdle: string;
    submitBusy: string;
    success: string;
    errorFallback: string;
    unexpected: string;
  };
  tenantSlug?: string;
};

// Lightweight contact form that posts to the contact API route.
export function ContactForm({ copy, tenantSlug }: ContactFormProps) {
  const [state, setState] = useState<ContactFormState>("idle");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const errorMap = new Map(errors.map((error) => [error.path, error.message]));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    if (tenantSlug) Object.assign(payload, { tenantSlug });

    try {
      const response = await fetch("/api/contact", {
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
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : copy.unexpected);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="text-xs uppercase tracking-[0.2em]">
        {copy.name}
        <input
          className={`hard-border mt-1 w-full px-3 py-2 ${
            errorMap.get("name") ? "input-error" : ""
          }`}
          name="name"
        />
      </label>
      {errorMap.get("name") ? (
        <p className="input-helper" data-variant="error">
          name: {errorMap.get("name")}
        </p>
      ) : null}
      <label className="text-xs uppercase tracking-[0.2em]">
        {copy.email}
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
        {copy.message}
        <textarea
          className={`hard-border mt-1 min-h-[120px] w-full px-3 py-2 ${
            errorMap.get("message") ? "input-error" : ""
          }`}
          name="message"
          minLength={10}
          required
        />
      </label>
      <label className="hidden" aria-hidden="true">
        Website
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />
      </label>
      {errorMap.get("message") ? (
        <p className="input-helper" data-variant="error">
          message: {errorMap.get("message")}
        </p>
      ) : null}
      <button
        className="snap-transition theme-border theme-invert w-full px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" && (
          <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {state === "submitting" ? copy.submitBusy : copy.submitIdle}
      </button>
      <AnimatePresence>
        {message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="validation-box"
            data-variant={state === "error" ? "error" : "success"}
            aria-live="polite"
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
