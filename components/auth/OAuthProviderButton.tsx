import Link from "next/link";
import { OAuthProviderIcon } from "@/components/auth/OAuthProviderIcon";

type OAuthProvider = "google" | "github";

type OAuthProviderButtonProps = {
  provider: OAuthProvider;
  href: string;
  label: string;
  variant?: "admin" | "register";
};

export function OAuthProviderButton({
  provider,
  href,
  label,
  variant = "admin",
}: OAuthProviderButtonProps) {
  return (
    <Link
      href={href}
      className={`oauth-provider-button ${variant === "register" ? "oauth-provider-button-register" : ""}`.trim()}
    >
      <span className="oauth-provider-icon-wrap">
        <OAuthProviderIcon provider={provider} />
      </span>
      <span>{label}</span>
    </Link>
  );
}
