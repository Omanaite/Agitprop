"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="admin-button admin-button-primary w-full"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

type AdminLoginFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export function AdminLoginForm({ action }: AdminLoginFormProps) {
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--admin-title)]">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="admin-input"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--admin-title)]">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
