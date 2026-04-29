import Link from "next/link";

type MarketingNavProps = {
  showAnchors?: boolean;
  rightSlot?: React.ReactNode;
};

export function MarketingNav({ showAnchors = false, rightSlot }: MarketingNavProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[color-mix(in_srgb,var(--mkt-bg)_85%,transparent)] border-b border-[var(--mkt-border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/agitprop" className="mkt-display text-lg font-semibold tracking-tight">
          Agitprop
        </Link>
        {showAnchors && (
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors">Features</a>
            <a href="#pricing" className="text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors">How it works</a>
          </nav>
        )}
        <div className="flex items-center gap-3">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
