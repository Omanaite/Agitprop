import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <header className="border-b border-black px-6 py-4 flex items-center justify-between">
        <Link href="/agitprop" className="text-sm uppercase tracking-widest hover:underline">
          ← Agitprop
        </Link>
        <nav className="flex gap-6 text-xs uppercase tracking-widest">
          <Link href="/legal/impressum" className="hover:underline">Impressum</Link>
          <Link href="/legal/agb" className="hover:underline">AGB</Link>
          <Link href="/legal/datenschutz" className="hover:underline">Datenschutz</Link>
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        {children}
      </main>
      <footer className="border-t border-black px-6 py-4 text-xs text-center uppercase tracking-widest">
        Agitprop — {new Date().getFullYear()}
      </footer>
    </div>
  );
}
