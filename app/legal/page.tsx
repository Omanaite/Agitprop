import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal | Agitprop",
  robots: { index: false, follow: false },
};

const pages = [
  {
    href: "/legal/impressum",
    de: "Impressum",
    es: "Aviso legal",
    desc: "Angaben gemäß § 5 DDG — datos del operador.",
  },
  {
    href: "/legal/agb",
    de: "Allgemeine Geschäftsbedingungen",
    es: "Términos y Condiciones",
    desc: "Nutzungsbedingungen, Marketplace-Regeln, Widerrufsrecht.",
  },
  {
    href: "/legal/datenschutz",
    de: "Datenschutzerklärung",
    es: "Política de Privacidad",
    desc: "DSGVO — Verarbeitung personenbezogener Daten.",
  },
];

export default function LegalIndexPage() {
  return (
    <div>
      <h1 className="text-4xl font-heading uppercase mb-2">Legal</h1>
      <p className="text-xs uppercase tracking-widest mb-12 opacity-50">
        agitprop.vercel.app — Rechtliche Informationen
      </p>
      <ul className="space-y-0 border-t border-black">
        {pages.map((p) => (
          <li key={p.href} className="border-b border-black">
            <Link
              href={p.href}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5 hover:bg-black hover:text-white transition-colors px-2 -mx-2 group"
            >
              <span className="font-bold text-sm uppercase">{p.de}</span>
              <span className="text-xs opacity-50 group-hover:opacity-70">{p.es}</span>
              <span className="text-xs opacity-40 sm:ml-auto group-hover:opacity-60">{p.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
