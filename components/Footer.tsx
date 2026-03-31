// Simple footer with location and studio notes.
type FooterProps = {
  studioLabel?: string;
  copyrightLabel?: string;
};

export function Footer({
  studioLabel = "Berlin - Private Studio",
  copyrightLabel = "Copyright 2026 Akemi Tattoo",
}: FooterProps) {
  return (
    <footer className="hard-border mt-10 flex flex-col gap-3 bg-[var(--bg)] px-6 py-6 text-xs uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between">
      <p>{studioLabel}</p>
      <div className="flex items-center gap-3">
        <a className="theme-border-thin px-2 py-1 theme-hover-invert" href="/agitprop">
          Agitprop
        </a>
        <p>{copyrightLabel}</p>
      </div>
    </footer>
  );
}

