/**
 * Akemi — Pilot Tenant Profile
 *
 * Akemi es la artista piloto de la plataforma Agitprop. No es un usuario especial
 * ni un administrador — es una tenant más, con su propio slug, tema y contenido de seed.
 * Su identidad se usa únicamente para asignarle el tema `akemi_brutalist` automáticamente
 * y para seedear contenido de demostración acorde a su estilo.
 *
 * Cualquier lógica que dependa de "si es Akemi" debe importar desde aquí,
 * no hardcodear strings en componentes.
 */

export const AKEMI_PILOT = {
  /** Identificadores de la cuenta piloto en Supabase */
  email: "akemi@tattoo.ink",
  slug: "akemion-tattoo",
  displayName: "Akemi",
  studioName: "Akemi on Tattoo",

  /** Tema visual exclusivo — definido en globals.css y lib/tenants/theme.ts */
  theme: "akemi_brutalist" as const,
  themeAlt: "akemi_brutalist_b" as const,

  /**
   * Estilo artístico del contenido de seed.
   * Usado por seedDemoContent() para generar piezas coherentes con el portfolio real.
   */
  artStyle: {
    primary: ["ignorant-style", "fine-line", "dotwork"],
    aesthetic: "anarco-surrealista",
    palette: "black-and-white",
    technique: "high-contrast",
  },

  /**
   * Design tokens del tema Akemi Brutalist.
   * Fuente de verdad en TypeScript — los valores CSS en globals.css deben coincidir.
   * Usar esto para tests de regresión visual o para generar CSS programáticamente.
   */
  designTokens: {
    light: {
      fg: "#000000",
      bg: "#ffffff",
      accent: "#000000",
      accentFg: "#ffffff",
      surface: "#f2f2f2",
      surface2: "#e8e8e8",
      muted: "#444444",
      borderColor: "#000000",
      borderWidth: "2px",
      radiusSm: "0px",
      radiusBtn: "0px",
      radiusCard: "0px",
      radiusInput: "0px",
      shadowSm: "2px 2px 0 #000000",
      shadowCard: "4px 4px 0 #000000",
      shadowBtn: "4px 4px 0 #000000",
      timing: "steps(1)",
      duration: "0ms",
    },
    dark: {
      fg: "#ffffff",
      bg: "#000000",
      accent: "#ffffff",
      accentFg: "#000000",
      surface: "rgba(255,255,255,0.06)",
      surface2: "rgba(255,255,255,0.10)",
      borderColor: "#ffffff",
      borderWidth: "2px",
      radiusSm: "0px",
      radiusBtn: "0px",
      radiusCard: "0px",
      radiusInput: "0px",
      timing: "steps(1)",
      duration: "0ms",
    },
    typography: {
      fontFamily: '"JetBrains Mono", "Space Mono", monospace',
      letterSpacing: "-0.01em",
      headingTransform: "uppercase",
      headingTracking: "negative",
    },
    principles: [
      "Sin border-radius — esquinas vivas siempre",
      "Sin transiciones suaves — steps(1) o corte directo",
      "Sin sombras decorativas — solo offset sólido 4px",
      "Hover = inversión instantánea de color",
      "Grid asimétrico — romper alineación vertical",
      "Imágenes: grayscale(100%) contrast(110%)",
    ],
  },
} as const;

/** Helper: detecta si un email/slug pertenece al tenant piloto */
export function isAkemiPilot(email: string, slug?: string): boolean {
  return (
    email.trim().toLowerCase() === AKEMI_PILOT.email ||
    (slug ?? "").trim().toLowerCase() === AKEMI_PILOT.slug
  );
}
