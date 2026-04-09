import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Agitprop",
  robots: { index: false, follow: false },
};

const LAST_UPDATED = "2026-04-07";

export default function DatenschutzPage() {
  return (
    <article className="prose-legal">
      <h1 className="text-4xl font-heading uppercase mb-2">Datenschutzerklärung</h1>
      <p className="text-xs uppercase tracking-widest mb-2 opacity-50">
        Agitprop — agitprop.vercel.app
      </p>
      <p className="text-xs mb-12 opacity-40">Stand: {LAST_UPDATED}</p>

      {/* ─── DEUTSCH ────────────────────────────────────── */}
      <section className="mb-20 space-y-10 text-sm leading-relaxed">

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          </p>
          <p className="mt-2">
            Pablo Horacio Chandia Cornejo<br />
            Paul-Heyse-Str. 47<br />
            04347 Leipzig<br />
            Deutschland<br />
            E-Mail: chandiapablo@outlook.com
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">2. Arten der verarbeiteten Daten</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bestandsdaten (Name, E-Mail-Adresse)</li>
            <li>Nutzungsdaten (besuchte Seiten, Zugriffszeitpunkte, IP-Adressen)</li>
            <li>Inhaltsdaten (hochgeladene Bilder und Kunstwerke)</li>
            <li>Zahlungsdaten (verarbeitet durch Drittanbieter, nicht direkt gespeichert)</li>
            <li>Kommunikationsdaten (Kontaktanfragen, Buchungsanfragen)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">3. Zwecke der Verarbeitung</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bereitstellung und Betrieb der Plattform (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Nutzerverwaltung und Authentifizierung (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Sicherheit und Missbrauchsprävention (Art. 6 Abs. 1 lit. f DSGVO)</li>
            <li>Abwicklung von Kaufverträgen (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Gesetzliche Pflichten (Art. 6 Abs. 1 lit. c DSGVO)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">4. Hosting — Vercel Inc.</h2>
          <p>
            Die Plattform wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
            USA, gehostet. Im Rahmen des Hostings werden Nutzerdaten (insbesondere
            IP-Adressen, Zugriffszeiten) durch Vercel verarbeitet.
          </p>
          <p className="mt-2">
            Mit Vercel besteht ein Datenverarbeitungsvertrag (Data Processing Addendum,
            DPA) gemäß Art. 28 DSGVO. Die Übermittlung von Daten in die USA erfolgt auf
            Grundlage von Standardvertragsklauseln (SCCs) gemäß Art. 46 Abs. 2 lit. c
            DSGVO. Das DPA ist abrufbar unter:{" "}
            <a
              href="https://vercel.com/legal/dpa"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              vercel.com/legal/dpa
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">5. Authentifizierung — Supabase</h2>
          <p>
            Für die Nutzerverwaltung und Authentifizierung wird Supabase (Supabase Inc.,
            970 Toa Payoh North #07-04, Singapur) eingesetzt. Dabei werden E-Mail-Adresse
            und Passwort-Hash gespeichert. Mit Supabase besteht ein DPA gemäß Art. 28 DSGVO.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">6. Zahlungsabwicklung</h2>
          <p>
            Zahlungen werden über [ZAHLUNGSDIENSTLEISTER — PENDIENTE] abgewickelt.
            Zahlungsdaten (Karteninformationen, Bankdaten) werden ausschließlich durch den
            Zahlungsdienstleister verarbeitet und nicht vom Betreiber gespeichert. Es gelten
            die Datenschutzbestimmungen des jeweiligen Anbieters.
          </p>
          {/* Stripe DPA: https://stripe.com/de/legal/dpa */}
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">7. Cookies</h2>
          <p>
            Die Plattform verwendet ausschließlich technisch notwendige Cookies für die
            Authentifizierung (Session-Cookies). Diese Cookies sind für den Betrieb der
            Plattform zwingend erforderlich (Art. 6 Abs. 1 lit. b DSGVO) und erfordern
            keine Einwilligung gemäß § 25 Abs. 2 TTDSG.
          </p>
          <p className="mt-2">
            Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
            {/*
              Si en el futuro añades analytics (Vercel Analytics, Plausible, etc.),
              debes actualizar esta sección y añadir un banner de consentimiento.
            */}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">8. Speicherung und Löschung</h2>
          <p>
            Personenbezogene Daten werden nur so lange gespeichert, wie dies für die
            jeweiligen Zwecke erforderlich ist. Nach Kündigung des Nutzerkontos werden die
            personenbezogenen Daten innerhalb von 30 Tagen gelöscht, soweit keine
            gesetzlichen Aufbewahrungspflichten (z. B. steuerliche Pflichten gemäß § 147
            AO: 10 Jahre) entgegenstehen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">9. Rechte der betroffenen Personen</h2>
          <p>Nutzer haben gemäß DSGVO folgende Rechte:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Auskunftsrecht</strong> (Art. 15 DSGVO): Auskunft über verarbeitete
              Daten
            </li>
            <li>
              <strong>Berichtigungsrecht</strong> (Art. 16 DSGVO): Berichtigung unrichtiger
              Daten
            </li>
            <li>
              <strong>Löschungsrecht</strong> (Art. 17 DSGVO): Löschung der Daten
              (&quot;Recht auf Vergessenwerden&quot;)
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)
            </li>
            <li>
              <strong>Beschwerderecht</strong> bei einer Aufsichtsbehörde (Art. 77 DSGVO)
            </li>
          </ul>
          <p className="mt-2">
            Zur Ausübung dieser Rechte wenden Sie sich an: chandiapablo@outlook.com
          </p>
          <p className="mt-2">
            Zuständige Aufsichtsbehörde: Sächsischer Datenschutzbeauftragter (SDtB), Devrientstraße 5, 01067 Dresden.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">10. Sicherheit</h2>
          <p>
            Der Betreiber setzt technische und organisatorische Maßnahmen ein, um die
            verarbeiteten Daten gegen Verlust, Zerstörung, Zugriff, Änderung oder
            Verbreitung durch Unbefugte zu schützen (Art. 32 DSGVO). Dazu zählen
            verschlüsselte Datenübertragung (HTTPS/TLS), Zugriffskontrollen und
            regelmäßige Sicherheitsüberprüfungen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">11. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Diese Datenschutzerklärung kann bei Änderungen der Plattform oder der
            Rechtslage aktualisiert werden. Das Datum der letzten Aktualisierung ist oben
            angegeben. Bei wesentlichen Änderungen werden Nutzer per E-Mail informiert.
          </p>
        </div>
      </section>

      {/* ─── ESPAÑOL ────────────────────────────────────── */}
      <section className="border-t border-black pt-12 space-y-8 text-sm leading-relaxed opacity-70">
        <h2 className="text-xs uppercase tracking-widest border-b border-black pb-1 mb-6">
          Español (Traducción para revisión — no tiene valor legal)
        </h2>

        <div>
          <h3 className="font-bold mb-2">1. Responsable del tratamiento</h3>
          <p>Pablo Horacio Chandia Cornejo, Paul-Heyse-Str. 47, 04347 Leipzig, Alemania. Email: chandiapablo@outlook.com</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">4. Hosting — Vercel Inc.</h3>
          <p>
            La plataforma está alojada en Vercel Inc. (EE. UU.). Existe un Acuerdo de
            Procesamiento de Datos (DPA) con Vercel conforme al Art. 28 RGPD, disponible en
            vercel.com/legal/dpa. La transferencia de datos a EE. UU. se basa en Cláusulas
            Contractuales Estándar (CCE) según el Art. 46 párr. 2 lit. c RGPD.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">5. Autenticación — Supabase</h3>
          <p>
            La gestión de usuarios se realiza mediante Supabase. Se almacenan email y hash
            de contraseña. Existe DPA con Supabase conforme al Art. 28 RGPD.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">7. Cookies</h3>
          <p>
            Solo se usan cookies técnicas necesarias para la autenticación (cookies de
            sesión). No se usan cookies de rastreo ni marketing. No se requiere
            consentimiento para estas cookies según el § 25 párr. 2 TTDSG.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">9. Derechos de los usuarios</h3>
          <p>
            Conforme al RGPD, los usuarios tienen derecho de acceso, rectificación,
            supresión (&quot;derecho al olvido&quot;), limitación del tratamiento,
            portabilidad de datos, oposición y reclamación ante la autoridad supervisora.
            Para ejercerlos: chandiapablo@outlook.com.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Nota sobre seguros (solo para el propietario)</h3>
          <p className="italic">
            Como desarrollador en Alemania, considera contratar una
            Berufshaftpflichtversicherung (seguro de responsabilidad civil profesional).
            Te protege ante reclamaciones de artistas por errores de código que provoquen
            pérdida de datos o perjuicios económicos. Proveedores habituales: Exali, Hiscox,
            Allianz.
          </p>
        </div>
      </section>
    </article>
  );
}
