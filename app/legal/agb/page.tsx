import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB | Agitprop",
  robots: { index: false, follow: false },
};

const LAST_UPDATED = "2026-04-09"; // Actualizar en cada revisión

export default function AGBPage() {
  return (
    <article className="prose-legal">
      <h1 className="text-4xl font-heading uppercase mb-2">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>
      <p className="text-xs uppercase tracking-widest mb-2 opacity-50">
        Agitprop — agitprop.vercel.app
      </p>
      <p className="text-xs mb-12 opacity-40">Stand: {LAST_UPDATED}</p>

      {/* ─── DEUTSCH ────────────────────────────────────── */}
      <section className="mb-20 space-y-10 text-sm leading-relaxed">

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 1 Geltungsbereich und Anbieter</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der
            Plattform Agitprop (nachfolgend „Plattform"), betrieben von Pablo Horacio Chandia Cornejo,
            Paul-Heyse-Str. 47, 04347 Leipzig, Deutschland (nachfolgend „Betreiber").
          </p>
          <p className="mt-2">
            Agitprop ist eine kostenlose digitale Plattform für unabhängige Künstler
            (Musiker, Illustratoren, Fotografen, Tätowierer u. a.), auf der diese ihr Portfolio
            veröffentlichen, Buchungsanfragen empfangen und ihre Online-Präsenz verwalten können.
            Agitprop ist kein Verkaufsmarktplatz.
          </p>
          <p className="mt-2">
            Abweichende Bedingungen der Nutzer werden nicht anerkannt, es sei denn, der
            Betreiber stimmt ihrer Geltung ausdrücklich schriftlich zu.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 2 Vertragsschluss und Nutzung</h2>
          <p>
            Die Nutzung der Plattform setzt eine Registrierung voraus. Mit Abschluss der
            Registrierung und Bestätigung dieser AGB kommt ein Nutzungsvertrag zwischen dem
            Betreiber und dem Nutzer zustande.
          </p>
          <p className="mt-2">
            Die Grundnutzung der Plattform ist kostenlos. Es fallen keine Abonnementgebühren an.
            Kostenpflichtige Leistungen sind ausschließlich die freiwillige Erweiterung des
            Speicherplatzes sowie die Registrierung einer eigenen Domain (siehe § 3a).
          </p>
          <p className="mt-2">
            Der Nutzer versichert, volljährig zu sein und die Plattform nur für rechtmäßige
            Zwecke zu nutzen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 3 Rolle des Betreibers</h2>
          <p>
            Agitprop ist eine Präsentations- und Verwaltungsplattform für unabhängige Künstler.
            Der Betreiber stellt die technische Infrastruktur bereit, um Portfolios, Buchungsanfragen,
            Veröffentlichungen und Kontaktmöglichkeiten zu verwalten.
          </p>
          <p className="mt-2">
            Der Betreiber ist kein Vertragspartei von Vereinbarungen zwischen Künstlern und
            deren Kunden (z. B. Buchungen, Kommissionen oder Zahlungen). Diese Verträge kommen
            ausschließlich zwischen dem Künstler und dem Endkunden zustande.
          </p>
          <p className="mt-2">
            Zahlungsabwicklungen (PayPal, Stripe) werden direkt zwischen dem Künstler und dem
            Kunden abgewickelt. Der Betreiber übernimmt keine Haftung für diese Transaktionen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 3a Speicherplatz und Domains</h2>
          <p className="font-bold mt-2">Kostenloser Speicher</p>
          <p className="mt-2">
            Jedes Konto verfügt über ein kostenloses Speicherkontingent: 2 Galerien, 25 Werke
            und 5 Beiträge. Bei Erreichen dieses Limits kann der Nutzer ältere Inhalte löschen,
            um Platz freizugeben, oder eine Speichererweiterung beantragen.
          </p>
          <p className="mt-2">
            Eine Speichererweiterung ist kein Abonnement. Es handelt sich um eine einmalige
            Zahlung, deren Höhe in Abhängigkeit vom benötigten Umfang mit dem Betreiber
            vereinbart wird. Kontakt: chandiapablo@outlook.com.
          </p>
          <p className="font-bold mt-4">Custom Domain über Vercel</p>
          <p className="mt-2">
            Nutzer, die eine eigene Domain wünschen, können diese direkt über Vercel (vercel.com)
            erwerben. Agitprop ist auf der Vercel-Infrastruktur gehostet; die Vercel-Domain-API
            ist direkt in die Plattform integriert, sodass die Domain nach dem Kauf automatisch
            mit der Künstlerseite verbunden wird. Der Nutzer zahlt den von Vercel festgelegten
            Preis direkt an Vercel — der Betreiber erhebt keinen Aufschlag.
          </p>
          <p className="font-bold mt-4">Domain bei einem anderen Anbieter</p>
          <p className="mt-2">
            Falls der Nutzer eine Domain besitzt, die bei einem Drittanbieter (z. B. GoDaddy,
            Namecheap, Google Domains) registriert ist, ist eine Verbindung mit der Plattform
            nur im Rahmen einer individuellen Vereinbarung mit dem Entwickler möglich.
            In diesem Fall ist eine gesonderte Absprache mit dem Betreiber unter
            chandiapablo@outlook.com erforderlich.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 4 Pflichten der Nutzer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Nutzer dürfen ausschließlich Inhalte hochladen, für die sie die erforderlichen
              Rechte besitzen.
            </li>
            <li>
              Das Hochladen, Verbreiten oder Anbieten von rechtswidrigen, pornografischen,
              gewaltverherrlichenden, diskriminierenden oder urheberrechtlich geschützten
              Inhalten Dritter ist strengstens untersagt.
            </li>
            <li>
              Nutzer sind verpflichtet, ihre Zugangsdaten sicher aufzubewahren und dem
              Betreiber unbefugte Zugriffe unverzüglich zu melden.
            </li>
            <li>
              Jede automatisierte Nutzung der Plattform (Scraping, Bots) ohne ausdrückliche
              schriftliche Genehmigung des Betreibers ist verboten.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 5 Geistiges Eigentum</h2>
          <p>
            <strong>Plattform:</strong> Das Design, der Quellcode, die Marke „Agitprop"
            sowie alle vom Betreiber erstellten Inhalte der Plattform sind Eigentum des
            Betreibers und durch das Urheberrechtsgesetz (UrhG) geschützt. Jede Nutzung
            ohne ausdrückliche Genehmigung ist untersagt.
          </p>
          <p className="mt-2">
            <strong>Inhalte der Künstler:</strong> Die Künstler bleiben Inhaber aller
            Rechte an ihren hochgeladenen Werken. Durch das Hochladen räumen sie dem
            Betreiber eine nicht-exklusive, kostenlose, weltweit gültige Lizenz ein, die
            Werke zum Zweck des Betriebs und der Darstellung der Plattform zu nutzen,
            zu speichern, zu vervielfältigen und darzustellen. Diese Lizenz endet mit dem
            Löschen des Werkes durch den Künstler.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 6 Notice-and-Takedown-Verfahren</h2>
          <p>
            Werden dem Betreiber Inhalte gemeldet, die Rechte Dritter verletzen oder gegen
            geltendes Recht verstoßen, wird der Betreiber diese nach Prüfung unverzüglich
            entfernen (Notice and Takedown gemäß Art. 16 DSA).
          </p>
          <p className="mt-2">
            Meldungen sind per E-Mail an chandiapablo@outlook.com zu richten und müssen folgende
            Angaben enthalten: (a) Bezeichnung des beanstandeten Inhalts mit URL,
            (b) Begründung der Rechtsverletzung, (c) Kontaktdaten des Meldenden.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 7 Widerrufsbelehrung</h2>
          <p className="font-bold">Widerrufsrecht</p>
          <p className="mt-2">
            Verbrauchern steht das Recht zu, binnen vierzehn Tagen ohne Angabe von Gründen
            diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem
            Tag des Vertragsschlusses.
          </p>
          <p className="mt-2">
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Pablo Horacio Chandia Cornejo,
            chandiapablo@outlook.com) mittels einer eindeutigen Erklärung (z. B. eine per Post
            versandte E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
            informieren.
          </p>
          <p className="mt-2 font-bold">Erlöschen des Widerrufsrechts</p>
          <p className="mt-2">
            Bei digitalen Inhalten (z. B. digitale Kunstwerke, Downloads): Das
            Widerrufsrecht erlischt, wenn der Betreiber mit der Ausführung des Vertrages
            begonnen hat und der Verbraucher vor Beginn der Ausführung ausdrücklich
            zugestimmt hat und seine Kenntnis bestätigt hat, dass er sein Widerrufsrecht
            verliert (§ 356 Abs. 5 BGB).
          </p>
          <p className="mt-2 font-bold">Folgen des Widerrufs</p>
          <p className="mt-2">
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von
            Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem
            Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf eingegangen ist.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 8 Haftungsausschluss</h2>
          <p>
            Der Betreiber haftet nicht für technische Ausfälle, Datenverluste, Ausfälle
            des Hosting-Dienstleisters (Vercel Inc.) oder sonstige Beeinträchtigungen der
            Plattform, soweit diese nicht auf Vorsatz oder grober Fahrlässigkeit des
            Betreibers beruhen.
          </p>
          <p className="mt-2">
            Der Betreiber haftet nicht für Inhalte, die von Nutzern hochgeladen wurden,
            noch für Schäden, die durch die Nutzung dieser Inhalte entstehen.
          </p>
          <p className="mt-2">
            Bei leichter Fahrlässigkeit ist die Haftung des Betreibers auf den
            vorhersehbaren, vertragstypischen Schaden begrenzt. Die Haftungsbeschränkung
            gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der
            Gesundheit.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 9 Kündigung und Sperrung</h2>
          <p>
            Beide Parteien können den Nutzungsvertrag jederzeit kündigen. Der Betreiber
            behält sich das Recht vor, Nutzer, die gegen diese AGB verstoßen, ohne
            Vorankündigung zu sperren oder dauerhaft zu löschen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 10 Änderungen der AGB</h2>
          <p>
            Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Nutzer werden
            über Änderungen per E-Mail informiert. Die weitere Nutzung der Plattform nach
            Bekanntgabe der Änderungen gilt als Zustimmung.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 11 Anwendbares Recht und Gerichtsstand</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
            UN-Kaufrechts (CISG). Für Verbraucher gilt diese Rechtswahl nur insoweit, als
            dadurch nicht zwingende Verbraucherschutzvorschriften des Staates, in dem der
            Verbraucher seinen gewöhnlichen Aufenthalt hat, eingeschränkt werden.
          </p>
          <p className="mt-2">
            Gerichtsstand für alle Streitigkeiten mit Kaufleuten oder juristischen Personen
            des öffentlichen Rechts ist Leipzig.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase mb-3">§ 12 Salvatorische Klausel</h2>
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein
            oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.
          </p>
        </div>
      </section>

      {/* ─── ESPAÑOL ────────────────────────────────────── */}
      <section className="border-t border-black pt-12 space-y-8 text-sm leading-relaxed opacity-70">
        <h2 className="text-xs uppercase tracking-widest border-b border-black pb-1 mb-6">
          Español (Traducción para revisión — no tiene valor legal)
        </h2>

        <div>
          <h3 className="font-bold mb-2">§ 1 Ámbito de aplicación y proveedor</h3>
          <p>
            Estas Condiciones Generales rigen el uso de la plataforma Agitprop
            (agitpropstudio.vercel.app), operada por Pablo Horacio Chandia Cornejo,
            Paul-Heyse-Str. 47, 04347 Leipzig, Alemania.
            Agitprop es una plataforma gratuita de presencia digital para artistas independientes.
            No es un marketplace de compraventa.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 2 Uso gratuito y costos opcionales</h3>
          <p>
            El uso básico de la plataforma es completamente gratuito. No existen suscripciones.
            Los únicos costos opcionales son: (1) ampliación de almacenamiento, acordada directamente
            con el desarrollador; (2) dominio propio comprado a través de Vercel al precio de Vercel.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 3 Rol del operador</h3>
          <p>
            El operador provee infraestructura técnica para que los artistas gestionen su portfolio,
            bookings y contenido. No es parte de ningún acuerdo entre el artista y sus clientes.
            Los pagos entre artista y cliente (vía PayPal o Stripe) son responsabilidad de las partes
            involucradas.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 3a Almacenamiento y dominios</h3>
          <p>
            <strong>Almacenamiento gratuito:</strong> 2 galerías, 25 piezas, 5 posts. Al llegar al
            límite, el artista puede eliminar contenido antiguo o solicitar una ampliación de pago único
            (no suscripción) acordada con el operador.
          </p>
          <p className="mt-2">
            <strong>Dominio vía Vercel:</strong> El artista puede comprar un dominio directamente en
            Vercel al precio de Vercel. Al registrarlo en el studio, queda conectado automáticamente.
            El operador no cobra comisión.
          </p>
          <p className="mt-2">
            <strong>Dominio en otro registrador:</strong> Requiere acuerdo individual con el desarrollador
            (chandiapablo@outlook.com).
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 5 Propiedad intelectual</h3>
          <p>
            El diseño, código fuente y marca &quot;Agitprop&quot; pertenecen al operador.
            Los artistas conservan todos los derechos sobre sus obras. Al subirlas, otorgan
            al operador una licencia no exclusiva y gratuita para mostrarlas en la plataforma,
            que se extingue al eliminar la obra.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 7 Derecho de desistimiento (Widerrufsrecht)</h3>
          <p>
            Los consumidores tienen derecho a desistir del contrato en un plazo de 14 días
            sin necesidad de justificación. Para contenidos digitales, este derecho se extingue
            si el usuario ha dado su consentimiento expreso para la ejecución inmediata y ha
            reconocido la pérdida del derecho de desistimiento (§ 356 párr. 5 BGB).
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 8 Limitación de responsabilidad</h3>
          <p>
            El operador no responde por fallos técnicos, pérdida de datos, caídas del
            proveedor de hosting (Vercel) ni por contenidos subidos por usuarios, salvo
            dolo o negligencia grave. La limitación no aplica a daños sobre la vida,
            integridad física o salud.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">§ 11 Ley aplicable</h3>
          <p>
            Se aplica el derecho alemán. Para consumidores, esta elección no priva de la
            protección obligatoria de su país de residencia.
          </p>
        </div>
      </section>
    </article>
  );
}
