// Simple footer with location and studio notes.
export function Footer() {
  return (
    <footer className="hard-border mt-10 flex flex-col gap-3 bg-[var(--bg)] px-6 py-6 text-xs uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between">
      <p>Berlin · Private Studio</p>
      <p>© 2026 Akemi Tattoo</p>
    </footer>
  );
}
