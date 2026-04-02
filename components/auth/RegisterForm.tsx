"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { RegisterActionState } from "@/app/register/actions";

type RegisterFormProps = {
  action: (
    prevState: RegisterActionState,
    formData: FormData
  ) => Promise<RegisterActionState>;
};

const initialState: RegisterActionState = {
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="admin-button admin-button-primary w-full"
      disabled={pending}
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

export function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--admin-title)]">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`admin-input ${state.fieldErrors?.email ? "admin-field-error" : ""}`}
        />
        {state.fieldErrors?.email ? (
          <p className="admin-helper mt-2" data-variant="error">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--admin-title)]">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={`admin-input ${state.fieldErrors?.password ? "admin-field-error" : ""}`}
        />
        {state.fieldErrors?.password ? (
          <p className="admin-helper mt-2" data-variant="error">
            {state.fieldErrors.password}
          </p>
        ) : (
          <p className="admin-helper mt-2">
            Use at least 8 characters. Admin access still requires approval.
          </p>
        )}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--admin-title)]">
          Confirm password
        </span>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={`admin-input ${state.fieldErrors?.confirmPassword ? "admin-field-error" : ""}`}
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="admin-helper mt-2" data-variant="error">
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}
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

      {state.message ? (
        <p
          className="admin-validation"
          data-variant={state.status === "success" ? "success" : "error"}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <Link
          href="/studio/login"
          className="admin-button admin-button-primary w-full justify-center"
        >
          Sign in to your workspace
        </Link>
      ) : (
        <SubmitButton />
      )}
    </form>
  );
}
