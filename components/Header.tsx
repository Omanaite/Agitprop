// Primary navigation header with brutalist, high-contrast layout.
export function Header() {
  return (
    <header className="hard-border flex flex-col gap-6 bg-white px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.5em]">Akemi</p>
        <h1 className="font-[var(--font-heading)] text-4xl uppercase md:text-5xl">
          Tattoo Manifesto
        </h1>
      </div>
      <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em]">
        <a
          className="snap-transition border border-black px-2 py-1 hover:bg-black hover:text-white"
          href="#work"
        >
          Work
        </a>
        <a
          className="snap-transition border border-black px-2 py-1 hover:bg-black hover:text-white"
          href="#about"
        >
          About
        </a>
        <a
          className="snap-transition border border-black px-2 py-1 hover:bg-black hover:text-white"
          href="#booking"
        >
          Booking
        </a>
        <a
          className="snap-transition border border-black px-2 py-1 hover:bg-black hover:text-white"
          href="#rates"
        >
          Rates
        </a>
        <a
          className="snap-transition border border-black px-2 py-1 hover:bg-black hover:text-white"
          href="#contact"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
