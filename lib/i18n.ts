export const supportedLocales = ["en", "es", "de"] as const;

export type Locale = (typeof supportedLocales)[number];

export const localeCookieName = "locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes((value ?? "") as Locale);
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : "en";
}

export type PublicDictionary = {
  brand: { eyebrow: string; title: string };
  theme: { light: string; eye: string; dark: string };
  locale: { label: string };
  hero: { body: string };
  about: { body1: string; body2: string };
  booking: {
    intro: string;
    name: string;
    email: string;
    preferredDate: string;
    placement: string;
    description: string;
    submitIdle: string;
    submitBusy: string;
    success: string;
    errorFallback: string;
    unexpected: string;
    availableDates: string;
    noAvailableDates: string;
    selectTime: string;
    noTimesForDay: string;
    loading: string;
    slotFull: string;
    slotOccupied: string;
    spotsAvailable: string;
    spotAvailable: string;
    selectDateFirst: string;
    selectSlotFirst: string;
  };
  contact: {
    name: string;
    email: string;
    message: string;
    submitIdle: string;
    submitBusy: string;
    success: string;
    errorFallback: string;
    unexpected: string;
  };
  rates: {
    depositNote: string;
    paymentStateStripeUnavailable: string;
    paymentStatePaypalUnavailable: string;
    paymentStateRedirecting: string;
    paymentStateCreating: string;
    payDepositStripe: string;
    payDepositPaypal: string;
    payDesignStripe: string;
    payDesignPaypal: string;
    cards: Array<{ title: string; description: string; price: string }>;
  };
  work: { filter: string; all: string };
  galleries: { empty: string; viewLocation: string; tapToView: string };
  posts: { empty: string; readMore: string };
  footer: { studio: string; copyright: string };
};

export const publicDictionaries: Record<Locale, PublicDictionary> = {
  en: {
    brand: { eyebrow: "Akemi", title: "Tattoo Manifesto" },
    theme: { light: "Light", eye: "Eye", dark: "Dark" },
    locale: { label: "Language" },
    hero: {
      body: "Akemi is a Berlin-based tattoo artist working at the intersection of ignorant linework, fine-line precision, and surreal anatomy. This portfolio is a living archive of pieces, flash fragments, and booking rituals.",
    },
    about: {
      body1: "Each line is a refusal of ornament. The body is a canvas, the ink is evidence. Expect high-contrast blackwork, raw texture, and anatomical distortions that feel like found objects from a terminal-era zine.",
      body2: "Studio policy: only custom projects, no replicas. Respect the ritual; respect the aftercare.",
    },
    booking: {
      intro: "Slots open monthly. Use the form below. Replies within 48 hours.",
      name: "Name",
      email: "Email",
      preferredDate: "Preferred Date",
      placement: "Placement / Size",
      description: "Description",
      submitIdle: "Request Session",
      submitBusy: "Submitting...",
      success: "Booking request sent. We will reply within 48h.",
      errorFallback: "Booking failed.",
      unexpected: "Unexpected error occurred.",
      availableDates: "Available dates",
      noAvailableDates: "No available dates at the moment.",
      selectTime: "Available times",
      noTimesForDay: "No times available for this day.",
      loading: "Loading...",
      slotFull: "Full",
      slotOccupied: "Occupied",
      spotsAvailable: "spots available",
      spotAvailable: "spot available",
      selectDateFirst: "Select a date to continue.",
      selectSlotFirst: "Select a time slot to continue.",
    },
    contact: {
      name: "Name",
      email: "Email",
      message: "Message",
      submitIdle: "Send Message",
      submitBusy: "Sending...",
      success: "Message sent. We will reply soon.",
      errorFallback: "Message failed.",
      unexpected: "Unexpected error occurred.",
    },
    rates: {
      depositNote: "Deposits are required to confirm a session.",
      paymentStateStripeUnavailable: "Stripe unavailable.",
      paymentStatePaypalUnavailable: "PayPal unavailable.",
      paymentStateRedirecting: "Redirecting...",
      paymentStateCreating: "Creating order...",
      payDepositStripe: "Pay Deposit with Stripe",
      payDepositPaypal: "Pay Deposit with PayPal",
      payDesignStripe: "Pay Design with Stripe",
      payDesignPaypal: "Pay Design with PayPal",
      cards: [
        { title: "Session Deposit", description: "Secures your booking slot. Non-refundable.", price: "EUR 120" },
        { title: "Custom Design", description: "Standalone design package with two revisions.", price: "EUR 220" },
        { title: "Full Day", description: "Large scale pieces, 6-7 hours of work.", price: "EUR 650" },
      ],
    },
    work: { filter: "Filter", all: "All" },
    galleries: { empty: "Curated galleries are being prepared. Return soon for the next release.", viewLocation: "View location", tapToView: "Tap to view details" },
    posts: { empty: "Studio notes are offline for editing. New entries will be published soon.", readMore: "Read more →" },
    footer: {
      studio: "Berlin - Private Studio",
      copyright: "Copyright 2026 Akemi Tattoo",
    },
  },
  es: {
    brand: { eyebrow: "Akemi", title: "Manifiesto Tattoo" },
    theme: { light: "Claro", eye: "Descanso", dark: "Oscuro" },
    locale: { label: "Idioma" },
    hero: {
      body: "Akemi es una tatuadora basada en Berlin que trabaja entre lineas ignorantes, precision fine-line y anatomia surreal. Este portfolio funciona como un archivo vivo de piezas, fragmentos de flash y rituales de reserva.",
    },
    about: {
      body1: "Cada linea rechaza el adorno. El cuerpo es lienzo y la tinta es evidencia. Espera blackwork de alto contraste, textura cruda y distorsiones anatomicas con energia de zine.",
      body2: "Politica de estudio: solo proyectos custom, sin replicas. Respeta el ritual y el aftercare.",
    },
    booking: {
      intro: "Los cupos se abren mensualmente. Usa el formulario. Respuesta dentro de 48 horas.",
      name: "Nombre",
      email: "Email",
      preferredDate: "Fecha preferida",
      placement: "Zona / Tamano",
      description: "Descripcion",
      submitIdle: "Solicitar sesion",
      submitBusy: "Enviando...",
      success: "Solicitud enviada. Responderemos dentro de 48h.",
      errorFallback: "La solicitud no pudo enviarse.",
      unexpected: "Ocurrio un error inesperado.",
      availableDates: "Fechas disponibles",
      noAvailableDates: "No hay fechas disponibles por el momento.",
      selectTime: "Horarios disponibles",
      noTimesForDay: "Sin horarios disponibles para este dia.",
      loading: "Cargando...",
      slotFull: "Completo",
      slotOccupied: "Ocupado",
      spotsAvailable: "lugares disponibles",
      spotAvailable: "lugar disponible",
      selectDateFirst: "Selecciona una fecha para continuar.",
      selectSlotFirst: "Selecciona un horario para continuar.",
    },
    contact: {
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      submitIdle: "Enviar mensaje",
      submitBusy: "Enviando...",
      success: "Mensaje enviado. Responderemos pronto.",
      errorFallback: "El mensaje no pudo enviarse.",
      unexpected: "Ocurrio un error inesperado.",
    },
    rates: {
      depositNote: "Se requiere deposito para confirmar una sesion.",
      paymentStateStripeUnavailable: "Stripe no disponible.",
      paymentStatePaypalUnavailable: "PayPal no disponible.",
      paymentStateRedirecting: "Redirigiendo...",
      paymentStateCreating: "Creando orden...",
      payDepositStripe: "Pagar deposito con Stripe",
      payDepositPaypal: "Pagar deposito con PayPal",
      payDesignStripe: "Pagar diseno con Stripe",
      payDesignPaypal: "Pagar diseno con PayPal",
      cards: [
        { title: "Deposito de sesion", description: "Asegura tu cupo. No reembolsable.", price: "EUR 120" },
        { title: "Diseno custom", description: "Paquete de diseno independiente con dos revisiones.", price: "EUR 220" },
        { title: "Dia completo", description: "Piezas de gran escala, 6-7 horas de trabajo.", price: "EUR 650" },
      ],
    },
    work: { filter: "Filtro", all: "Todo" },
    galleries: { empty: "Las galerias curadas se estan preparando. Vuelve pronto para la siguiente seleccion.", viewLocation: "Ver ubicacion", tapToView: "Toca para ver detalles" },
    posts: { empty: "Las notas del estudio estan en edicion. Habra nuevas publicaciones pronto.", readMore: "Leer mas →" },
    footer: {
      studio: "Berlin - Estudio privado",
      copyright: "Copyright 2026 Akemi Tattoo",
    },
  },
  de: {
    brand: { eyebrow: "Akemi", title: "Tattoo Manifest" },
    theme: { light: "Hell", eye: "Schonend", dark: "Dunkel" },
    locale: { label: "Sprache" },
    hero: {
      body: "Akemi ist eine Tattoo-Kuenstlerin aus Berlin, die zwischen ignorant linework, feiner Praezision und surrealer Anatomie arbeitet. Dieses Portfolio ist ein lebendiges Archiv aus Arbeiten, Flash-Fragmenten und Booking-Ritualen.",
    },
    about: {
      body1: "Jede Linie verweigert Ornament. Der Koerper ist Leinwand, die Tinte ist Beweis. Erwarte kontrastreiches Blackwork, rohe Textur und anatomische Verzerrungen mit Zine-Energie.",
      body2: "Studio-Regel: nur individuelle Projekte, keine Repliken. Respektiere das Ritual und die Aftercare.",
    },
    booking: {
      intro: "Termine werden monatlich freigegeben. Nutze das Formular. Antwort innerhalb von 48 Stunden.",
      name: "Name",
      email: "E-Mail",
      preferredDate: "Wunschtermin",
      placement: "Koerperstelle / Groesse",
      description: "Beschreibung",
      submitIdle: "Termin anfragen",
      submitBusy: "Wird gesendet...",
      success: "Anfrage gesendet. Wir antworten innerhalb von 48h.",
      errorFallback: "Die Anfrage konnte nicht gesendet werden.",
      unexpected: "Ein unerwarteter Fehler ist aufgetreten.",
      availableDates: "Verfuegbare Termine",
      noAvailableDates: "Derzeit keine Termine verfuegbar.",
      selectTime: "Verfuegbare Zeiten",
      noTimesForDay: "Keine Zeiten fuer diesen Tag verfuegbar.",
      loading: "Laden...",
      slotFull: "Ausgebucht",
      slotOccupied: "Belegt",
      spotsAvailable: "Plaetze verfuegbar",
      spotAvailable: "Platz verfuegbar",
      selectDateFirst: "Waehle ein Datum um fortzufahren.",
      selectSlotFirst: "Waehle eine Uhrzeit um fortzufahren.",
    },
    contact: {
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      submitIdle: "Nachricht senden",
      submitBusy: "Wird gesendet...",
      success: "Nachricht gesendet. Wir melden uns bald.",
      errorFallback: "Die Nachricht konnte nicht gesendet werden.",
      unexpected: "Ein unerwarteter Fehler ist aufgetreten.",
    },
    rates: {
      depositNote: "Zur Terminbestaetigung ist eine Anzahlung erforderlich.",
      paymentStateStripeUnavailable: "Stripe nicht verfuegbar.",
      paymentStatePaypalUnavailable: "PayPal nicht verfuegbar.",
      paymentStateRedirecting: "Weiterleitung...",
      paymentStateCreating: "Bestellung wird erstellt...",
      payDepositStripe: "Anzahlung mit Stripe zahlen",
      payDepositPaypal: "Anzahlung mit PayPal zahlen",
      payDesignStripe: "Design mit Stripe zahlen",
      payDesignPaypal: "Design mit PayPal zahlen",
      cards: [
        { title: "Session Anzahlung", description: "Sichert deinen Termin. Nicht erstattbar.", price: "EUR 120" },
        { title: "Custom Design", description: "Eigenstaendiges Designpaket mit zwei Revisionen.", price: "EUR 220" },
        { title: "Ganzer Tag", description: "Grossflaechige Arbeiten, 6-7 Stunden.", price: "EUR 650" },
      ],
    },
    work: { filter: "Filter", all: "Alle" },
    galleries: { empty: "Kurierte Galerien werden gerade vorbereitet. Schau bald wieder vorbei.", viewLocation: "Standort anzeigen", tapToView: "Tippen fuer Details" },
    posts: { empty: "Studio-Notizen werden gerade ueberarbeitet. Neue Eintraege folgen bald.", readMore: "Weiterlesen →" },
    footer: {
      studio: "Berlin - Privatstudio",
      copyright: "Copyright 2026 Akemi Tattoo",
    },
  },
};

export function getPublicDictionary(locale: Locale): PublicDictionary {
  return publicDictionaries[locale];
}
