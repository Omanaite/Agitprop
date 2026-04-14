"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

/**
 * OAuthTermsGate
 *
 * Mostrado en /register/complete cuando source=oauth.
 * El usuario debe aceptar AGB + Datenschutz antes de continuar al studio.
 * Sin aceptación, el botón principal queda deshabilitado.
 */
export function OAuthTermsGate({ primaryHref, primaryLabel, secondaryHref, secondaryLabel }: Props) {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-6 space-y-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--admin-accent)]"
        />
        <span className="text-sm text-[var(--admin-muted)] leading-5">
          I have read and accept the{" "}
          <Link href="/legal/agb" target="_blank" className="font-semibold text-[var(--admin-accent)] underline underline-offset-2">
            Terms and Conditions
          </Link>{" "}
          and the{" "}
          <Link href="/legal/datenschutz" target="_blank" className="font-semibold text-[var(--admin-accent)] underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {!accepted && (
        <p className="text-xs text-[var(--admin-muted)] opacity-60">
          Please accept the terms above to continue.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => accepted && router.push(primaryHref)}
          disabled={!accepted}
          className="admin-button admin-button-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {primaryLabel}
        </button>
        <Link href={secondaryHref} className="admin-button admin-button-ghost">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
