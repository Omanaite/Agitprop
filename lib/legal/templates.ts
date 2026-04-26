/**
 * Legal Templates — Agitprop
 *
 * Funciones deterministas que generan texto legal estructurado.
 * Reemplaza la skill `terms-page-generator` — el modelo NO necesita
 * "saber" cómo redactar legales: llama estas funciones y recibe output tipado.
 *
 * Fuente de datos del operador: este archivo.
 * Páginas Next.js: app/legal/{impressum,agb,datenschutz}/page.tsx
 *
 * Cuando añadas un proveedor de pagos real, actualiza `PAYMENT_PROVIDER`.
 */

export const OPERATOR = {
  fullName: "Pablo Horacio Chandia Cornejo",
  street: "Paul-Heyse-Str. 47",
  postalCode: "04347",
  city: "Leipzig",
  country: "Deutschland",
  email: "chandiapablo@outlook.com",
  steuernummer: "80 732 336 158",
  kleinunternehmer: false,
  gerichtsstand: "Leipzig",
  datenschutzbehoerde: "Sächsischer Datenschutzbeauftragter (SDtB), Devrientstraße 5, 01067 Dresden",
} as const;

/** Proveedor de pagos — pendiente de integración */
export const PAYMENT_PROVIDER = {
  name: null as string | null, // "Stripe" cuando esté integrado
  dpaUrl: null as string | null, // "https://stripe.com/de/legal/dpa"
} as const;

export type LegalSection = {
  id: string;
  titleDe: string;
  titleEs: string;
  bodyDe: string;
  bodyEs: string;
};

/** Devuelve el bloque de identificación del operador para Impressum y AGB */
export function getOperatorBlock(): { de: string; es: string } {
  const steuern = OPERATOR.kleinunternehmer
    ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmer)."
    : `Steuernummer: ${OPERATOR.steuernummer ?? "[PENDIENTE]"}`;

  return {
    de: [
      OPERATOR.fullName,
      OPERATOR.street,
      `${OPERATOR.postalCode} ${OPERATOR.city}`,
      OPERATOR.country,
      `E-Mail: ${OPERATOR.email}`,
      steuern,
    ].join("\n"),
    es: [
      OPERATOR.fullName,
      OPERATOR.street,
      `${OPERATOR.postalCode} ${OPERATOR.city}`,
      "Alemania",
      `Email: ${OPERATOR.email}`,
      OPERATOR.kleinunternehmer
        ? "Exención de pequeña empresa (§ 19 UStG) — sin IVA."
        : `NIF: ${OPERATOR.steuernummer ?? "[PENDIENTE]"}`,
    ].join("\n"),
  };
}

/** Metadatos legales para todas las páginas */
export const LEGAL_META = {
  lastUpdated: "2026-04-07",
  platform: "agitprop.vercel.app",
  governing_law: "Recht der Bundesrepublik Deutschland",
  jurisdiction: OPERATOR.gerichtsstand,
  supervisory_authority: OPERATOR.datenschutzbehoerde,
  os_platform: "https://ec.europa.eu/consumers/odr",
  vercel_dpa: "https://vercel.com/legal/dpa",
} as const;

/**
 * Genera las secciones de AGB como objetos tipados.
 * Útil para tests de regresión o para renderizar desde un CMS.
 */
export function getAGBSections(): LegalSection[] {
  const op = getOperatorBlock();
  return [
    {
      id: "scope",
      titleDe: "§ 1 Geltungsbereich und Anbieter",
      titleEs: "§ 1 Ámbito de aplicación",
      bodyDe: `Diese AGB gelten für die Nutzung der Plattform Agitprop (${LEGAL_META.platform}), betrieben von ${OPERATOR.fullName}, ${OPERATOR.street}, ${OPERATOR.postalCode} ${OPERATOR.city}.`,
      bodyEs: `Estas condiciones rigen el uso de Agitprop (${LEGAL_META.platform}), operada por ${OPERATOR.fullName}, ${OPERATOR.street}, ${OPERATOR.postalCode} ${OPERATOR.city}.`,
    },
    {
      id: "intermediary",
      titleDe: "§ 3 Vermittlerrolle",
      titleEs: "§ 3 Rol de intermediario",
      bodyDe: "Der Betreiber tritt als technischer Vermittler auf. Der Kaufvertrag kommt ausschließlich zwischen Künstler und Käufer zustande.",
      bodyEs: "El operador actúa solo como intermediario técnico. El contrato se celebra exclusivamente entre artista y comprador.",
    },
    {
      id: "withdrawal",
      titleDe: "§ 7 Widerrufsbelehrung",
      titleEs: "§ 7 Derecho de desistimiento",
      bodyDe: `Verbrauchern steht das Widerrufsrecht binnen 14 Tagen zu. Widerruf an: ${OPERATOR.email}. Bei digitalen Inhalten erlischt das Recht nach ausdrücklicher Zustimmung (§ 356 Abs. 5 BGB).`,
      bodyEs: `Los consumidores pueden desistir en 14 días. Notificar a: ${OPERATOR.email}. Para contenido digital, el derecho se extingue con el consentimiento expreso del usuario (§ 356 párr. 5 BGB).`,
    },
    {
      id: "governing_law",
      titleDe: `§ 11 Anwendbares Recht — Gerichtsstand ${OPERATOR.gerichtsstand}`,
      titleEs: `§ 11 Ley aplicable — Fuero: ${OPERATOR.gerichtsstand}`,
      bodyDe: `Es gilt ${LEGAL_META.governing_law}. Gerichtsstand: ${OPERATOR.gerichtsstand}.`,
      bodyEs: `Se aplica el derecho alemán. Fuero: ${OPERATOR.gerichtsstand}.`,
    },
  ];
}

/**
 * Genera las secciones de Datenschutzerklärung como objetos tipados.
 */
export function getDatenschutzSections(): LegalSection[] {
  return [
    {
      id: "controller",
      titleDe: "1. Verantwortlicher",
      titleEs: "1. Responsable del tratamiento",
      bodyDe: getOperatorBlock().de,
      bodyEs: getOperatorBlock().es,
    },
    {
      id: "hosting",
      titleDe: "4. Hosting — Vercel Inc.",
      titleEs: "4. Hosting — Vercel Inc.",
      bodyDe: `Hosting bei Vercel Inc., USA. DPA gemäß Art. 28 DSGVO geschlossen. SCCs gemäß Art. 46 Abs. 2 lit. c DSGVO. DPA: ${LEGAL_META.vercel_dpa}`,
      bodyEs: `Alojado en Vercel Inc. (EE. UU.). DPA conforme al Art. 28 RGPD. Transferencia basada en CCE. DPA: ${LEGAL_META.vercel_dpa}`,
    },
    {
      id: "payment",
      titleDe: "6. Zahlungsabwicklung",
      titleEs: "6. Procesamiento de pagos",
      bodyDe: PAYMENT_PROVIDER.name
        ? `Zahlungen über ${PAYMENT_PROVIDER.name}. DPA: ${PAYMENT_PROVIDER.dpaUrl}`
        : "Zahlungsabwicklung noch nicht implementiert — wird aktualisiert sobald ein Anbieter integriert wird.",
      bodyEs: PAYMENT_PROVIDER.name
        ? `Pagos mediante ${PAYMENT_PROVIDER.name}. DPA: ${PAYMENT_PROVIDER.dpaUrl}`
        : "Procesamiento de pagos pendiente de integración.",
    },
    {
      id: "supervisory",
      titleDe: "9. Aufsichtsbehörde",
      titleEs: "9. Autoridad supervisora",
      bodyDe: OPERATOR.datenschutzbehoerde,
      bodyEs: OPERATOR.datenschutzbehoerde,
    },
  ];
}
