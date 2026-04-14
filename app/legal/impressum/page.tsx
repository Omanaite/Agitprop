import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Agitprop",
  robots: { index: false, follow: false },
};

// ⚠️  PFLICHTANGABEN — Antes de publicar, reemplaza todos los [PLACEHOLDER]
// con tus datos reales. El Impressum sin datos reales puede resultar en
// Abmahnungen (advertencias legales con costos).

export default function ImpressumPage() {
  return (
    <article className="prose-legal">
      <h1 className="text-4xl font-heading uppercase mb-2">Impressum</h1>
      <p className="text-xs uppercase tracking-widest mb-12 opacity-50">
        Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
      </p>

      {/* ─── DE ─────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest border-b border-black pb-1 mb-6">
          Deutsch
        </h2>

        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <strong>Angaben gemäß § 5 DDG</strong>
            <p className="mt-2">
              Pablo Horacio Chandia Cornejo<br />
              Paul-Heyse-Str. 47<br />
              04347 Leipzig<br />
              Deutschland
            </p>
          </div>

          <div>
            <strong>Kontakt</strong>
            <p className="mt-2">
              E-Mail: chandiapablo@outlook.com<br />
              {/* Telefon ist optional, aber empfohlen: */}
              {/* Telefon: +49 [NUMMER] */}
            </p>
          </div>

          <div>
            <strong>Steuerliche Angaben</strong>
            <p className="mt-2">
              {/*
                Falls du als Kleinunternehmer tätig bist (§ 19 UStG),
                kannst du die USt-IdNr. weglassen und stattdessen schreiben:
                "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."

                Falls du umsatzsteuerpflichtig bist, trage hier ein:
              */}
              Steuernummer: 80 732 336 158<br />
              {/* USt-IdNr.: DE[NUMMER] — nur wenn vorhanden */}
            </p>
          </div>

          <div>
            <strong>Plattform der Europäischen Kommission zur Online-Streitbeilegung (OS)</strong>
            <p className="mt-2">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
              (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht verpflichtet und nicht bereit, an einem
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </div>

          <div>
            <strong>Haftung für Inhalte</strong>
            <p className="mt-2">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
              DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
              forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>

          <div>
            <strong>Haftung für Links</strong>
            <p className="mt-2">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
              wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
              keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
              jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </div>

          <div>
            <strong>Urheberrecht</strong>
            <p className="mt-2">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
              Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
              bzw. Erstellers.
            </p>
          </div>
        </div>
      </section>

      {/* ─── ES ─────────────────────────────────────────── */}
      <section className="border-t border-black pt-12">
        <h2 className="text-xs uppercase tracking-widest border-b border-black pb-1 mb-6">
          Español (Traducción para revisión — no tiene valor legal)
        </h2>

        <div className="space-y-6 text-sm leading-relaxed opacity-70">
          <div>
            <strong>Aviso legal conforme al § 5 DDG (Ley de Servicios Digitales)</strong>
            <p className="mt-2">
              Pablo Horacio Chandia Cornejo<br />
              Paul-Heyse-Str. 47<br />
              04347 Leipzig<br />
              Alemania
            </p>
          </div>

          <div>
            <strong>Contacto</strong>
            <p className="mt-2">
              Email: chandiapablo@outlook.com
            </p>
          </div>

          <div>
            <strong>Datos fiscales</strong>
            <p className="mt-2">
              Número de identificación fiscal: 80 732 336 158<br />
              Nota: Si operas bajo la exención de pequeña empresa (§ 19 UStG), no necesitas
              número de IVA y debes indicarlo explícitamente.
            </p>
          </div>

          <div>
            <strong>Plataforma de resolución de disputas online (UE)</strong>
            <p className="mt-2">
              La Comisión Europea ofrece una plataforma de resolución de disputas online en
              https://ec.europa.eu/consumers/odr. No estamos obligados ni dispuestos a
              participar en procedimientos de resolución de disputas ante un organismo de
              arbitraje de consumidores.
            </p>
          </div>

          <div>
            <strong>Responsabilidad por contenido</strong>
            <p className="mt-2">
              Como proveedor de servicios somos responsables de nuestros propios contenidos
              conforme al § 7 párr. 1 DDG. Según los §§ 8 a 10 DDG, no estamos obligados a
              supervisar información transmitida o almacenada de terceros.
            </p>
          </div>

          <div>
            <strong>Derechos de autor</strong>
            <p className="mt-2">
              Los contenidos creados por el operador del sitio están sujetos al derecho de
              autor alemán. La reproducción, edición, distribución o cualquier tipo de
              explotación fuera de los límites del derecho de autor requieren el
              consentimiento escrito del autor.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
