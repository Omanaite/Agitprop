"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type OAuthProviderIconProps = {
  provider: "google" | "github";
  className?: string;
};

export function OAuthProviderIcon({
  provider,
  className = "h-5 w-5",
}: OAuthProviderIconProps) {
  if (provider === "google") {
    return <FcGoogle className={className} aria-hidden="true" />;
  }

  return (
    <FaGithub
      className={`${className} text-[var(--admin-title)]`}
      aria-hidden="true"
    />
  );
}
