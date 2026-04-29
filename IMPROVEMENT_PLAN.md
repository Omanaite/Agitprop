# Akemi — Visual & UX Improvement Plan

> Plan exhaustivo de mejoras visuales, experiencia de usuario, normalización tipográfica e internacionalización.
> Basado en estándares: **Emil Kowalski** (Motion), **Impeccable** (Details) y **Taste Design** (Editorial).
> Cada ítem está estructurado para abrir un Pull Request independiente.

---

## Índice

1. [Tipografía — Normalización y escala](#1-tipografía--normalización-y-escala)
2. [i18n — Strings sin traducir](#2-i18n--strings-sin-traducir)
3. [Colores — Hardcoding vs variables CSS](#3-colores--hardcoding-vs-variables-css)
4. [Espaciado y Radios — Inconsistencias](#4-espaciado-y-radios--inconsistencias)
5. [Accesibilidad — Focus, ARIA, Contraste](#5-accesibilidad--focus-aria-contraste)
6. [UX — Estados vacíos, error, hover, disabled](#6-ux--estados-vacíos-error-hover-disabled)
7. [Formularios — Validación y feedback](#7-formularios--validación-y-feedback)
8. [Calidad de código CSS](#8-calidad-de-código-css)
9. [Auditoría de Estándares Premium (Kowalski/Impeccable/Taste)](#9-auditoría-de-estándares-premium)

---

## 1. Tipografía — Normalización y escala

### 1.1 — Crear escala tipográfica centralizada en CSS variables

**Prioridad:** 🔴 Alta  
**Tipo:** Design System

**Problema:** No existe ninguna escala tipográfica definida como tokens. Cada componente hardcodea clases Tailwind (`text-3xl`, `text-5xl`, `text-8xl`, etc.) sin referencia a una escala compartida. Esto produce que cambiar la "jerarquía" del sitio requiera editar docenas de archivos.

**Qué hacer:**  
Agregar en `app/globals.css`, dentro del bloque `@layer base`, un conjunto de variables CSS de tipografía:

```css
/* Typography scale tokens */
--type-eyebrow:    0.6875rem;  /* 11px - tracking 0.1em */
--type-label:      0.75rem;    /* 12px - labels de formulario, pies */
--type-body-sm:    0.875rem;   /* 14px */
--type-body:       1rem;       /* 16px */
--type-heading:    2.25rem;    /* 36px - leading 1.1, tracking -0.02em */
--type-display:    5rem;       /* 80px - leading 1.05, tracking -0.04em */

--track-eyebrow:   0.1em;
--track-nav:       0.2em;
--track-heading:   -0.02em;
--track-body:      0;
```

**Archivos afectados:**
- `app/globals.css` — agregar tokens
- `components/Section.tsx` — consumir `--type-heading` en lugar de `text-3xl md:text-4xl`
- `components/GalleryGrid.tsx` — modal title
- `components/PostFeed.tsx` — modal title
- `components/Footer.tsx` — texto de pie

**Puntos a tener en cuenta:**
- Los temas de artista (Ink, Atelier, Mono, etc.) pueden sobreescribir estos tokens dentro de su scope de tema si necesitan escalas dramáticamente distintas.
- No romper los breakpoints responsive: mantener los modificadores `md:` y `lg:` usando las variables.
## 9. Auditoría de Estándares Premium

### 9.1 — Refinamiento Editorial (Taste Design)
**Hallazgo:** Los encabezados masivos carecen de tracking negativo.
**Acción:** Aplicar `tracking-[-0.04em]` a cualquier texto mayor a `4rem`.

### 9.2 — Curvas de Animación (Emil Kowalski)
**Hallazgo:** Uso de `ease-in-out` estándar.
**Acción:** Reemplazar por `cubic-bezier(0.16, 1, 0.3, 1)` para transiciones de opacidad y transform.

### 9.3 — Feedback Háptico Visual
**Hallazgo:** Elementos interactivos estáticos al click.
**Acción:** Inyectar `active:scale-[0.98]` en todos los botones de la clase `mkt-button`.

---

### 1.2 — Normalizar tamaños de título entre variantes de header

**Prioridad:** 🔴 Alta  
**Tipo:** Visual / Consistencia

**Problema:** Cada variante de nav define su propio tamaño de título del artista con saltos extremos entre ellos:

| Componente | Mobile | Desktop | Problema |
|---|---|---|---|
| `NavAtelier.tsx:20` | `text-4xl` | `text-6xl` | Rango amplio |
| `NavMono.tsx:25` | `text-5xl` | `text-8xl` | **Extremo — 6rem → 8rem** |
| `NavInk.tsx:23` | `text-lg` | `text-2xl` | **Demasiado pequeño** |
| `NavVerdure.tsx:21` | `text-3xl` | `text-5xl` | Moderado |
| `NavAmber.tsx:27` | `text-3xl` | `text-5xl` | Moderado |

**Qué hacer:**  
Cada tema puede tener su propia escala, pero dentro de rangos razonables. Referenciar los tokens del punto 1.1 donde sea posible. Aplicar una revisión visual en cada header para que el nombre del artista sea legible en móvil sin quebrarse en 2+ líneas.

**Archivos afectados:**
- `components/headers/NavAtelier.tsx`
- `components/headers/NavMono.tsx`
- `components/headers/NavInk.tsx`
- `components/headers/NavVerdure.tsx`
- `components/headers/NavAmber.tsx`

**Puntos a tener en cuenta:**
- El nombre del artista puede ser largo (hasta 40 chars); asegurar `truncate` o `break-words` apropiado.
- Probar en viewport 375px y 1440px.

---

### 1.3 — Normalizar texto eyebrow: `text-[9px]` vs `text-[10px]`

**Prioridad:** 🟡 Media  
**Tipo:** Visual / Consistencia

**Problema:** `NavInk.tsx:22` usa `text-[9px]` como eyebrow mientras todos los demás headers usan `text-[10px]`. Después de implementar el token `--type-eyebrow` del punto 1.1, todos deben consumirlo.

**Archivos afectados:**
- `components/headers/NavInk.tsx` — cambiar `text-[9px]` a `text-[10px]` o al token CSS

---

### 1.4 — Normalizar letter-spacing de eyebrow/nav

**Prioridad:** 🟡 Media  
**Tipo:** Visual

**Problema:** Tracking inconsistente entre headers:

| Componente | Valor | Uso |
|---|---|---|
| `NavAtelier.tsx` | `tracking-[0.6em]` | Eyebrow |
| `NavAmber.tsx` | `tracking-[0.6em]` | Eyebrow |
| `NavInk.tsx:22` | `tracking-[0.8em]` | Eyebrow ← diferente |
| `NavInk.tsx:51` | `tracking-[1em]` | Overlay text ← único |
| `NavAmber.tsx` | `tracking-[0.05em]` | Nav items |
| `GalleryGrid.tsx:45` | `tracking-normal` | Modal ← rompe patrón |

**Qué hacer:**  
- Eyebrow: unificar en `tracking-[0.6em]` (salvo que un tema justifique excepción)
- Nav items: definir en el scope del tema como variable `--track-nav`
- Evitar `tracking-[1em]` salvo efecto deliberado

**Archivos afectados:**
- `components/headers/NavInk.tsx`
- `components/GalleryGrid.tsx`

---

## 2. i18n — Strings sin traducir

> El proyecto soporta `en`, `es`, `de`. Todo texto visible al usuario en componentes públicos debe pasar por el sistema de traducción en `lib/i18n.ts`.

### 2.1 — Strings hardcodeados en componentes públicos

**Prioridad:** 🔴 Alta  
**Tipo:** i18n

**Archivos y strings afectados:**

#### `components/GalleryGrid.tsx`
| Línea | String hardcodeado |
|---|---|
| ~71 | `"View location"` |
| ~94 | `"The archive is being updated. Check back soon for new work."` |
| ~132 | `"Tap to view details"` |

#### `components/PostFeed.tsx`
| Línea | String hardcodeado |
|---|---|
| ~52 | `"No posts published yet."` |
| ~77 | `"Read more →"` |

#### `components/headers/NavMono.tsx`
| Línea | String hardcodeado |
|---|---|
| ~65 | `"Navigation"` (en aria o texto visible) |

**Qué hacer:**
1. Agregar estas keys al tipo `PublicDictionary` en `lib/i18n.ts`
2. Agregar las traducciones en los tres objetos de locale (`en`, `es`, `de`)
3. Consumir via el prop `dict` que ya reciben la mayoría de componentes, o pasar la key como prop

**Archivos afectados:**
- `lib/i18n.ts` — agregar keys
- `components/GalleryGrid.tsx`
- `components/PostFeed.tsx`
- `components/headers/NavMono.tsx`

---

### 2.2 — Arrays de meses y días de la semana en español hardcodeados

**Prioridad:** 🔴 Alta  
**Tipo:** i18n / Bug funcional

**Problema:** Los arrays de nombres de meses y días están en español hardcodeado. Si el usuario cambia el idioma a inglés o alemán, el calendario sigue mostrando "Enero, Febrero..." o "Dom, Lun...".

**Archivos afectados:**

#### `components/BookingForm.tsx` (~línea 13)
```tsx
// ACTUAL (solo español):
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
```

#### `components/studio/StudioAvailabilityManager.tsx` (~líneas 16-17)
```tsx
// ACTUAL:
const DAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MONTHS = ["Enero",...];
```

**Qué hacer:**
- Opción A (recomendada): Usar `Intl.DateTimeFormat` nativo con el locale activo:
  ```ts
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  ```
- Opción B: Agregar los arrays a `lib/i18n.ts` para `en`, `es`, `de`

**Archivos afectados:**
- `components/BookingForm.tsx`
- `components/studio/StudioAvailabilityManager.tsx`
- `lib/i18n.ts` (si se elige opción B)

---

### 2.3 — Strings hardcodeados en Studio (panel del artista)

**Prioridad:** 🟡 Media  
**Tipo:** i18n

Aunque el studio es solo para el artista, si el artista usa un locale distinto al inglés, estos strings deben traducirse.

#### `components/studio/LocationSearch.tsx`
| Línea | String |
|---|---|
| ~105 | `"Location — type to search (optional)"` (placeholder) |
| ~136 | `"Searching…"` |

#### `components/studio/StudioPostManager.tsx`
| Línea | String |
|---|---|
| Varios | `"No posts yet"` (empty state) |

**Archivos afectados:**
- `components/studio/LocationSearch.tsx`
- `components/studio/StudioPostManager.tsx`
- `lib/i18n.ts` — agregar keys de studio si no existen

---

### 2.4 — Defaults hardcodeados en Footer

**Prioridad:** 🟡 Media  
**Tipo:** i18n / Datos

**Problema:** `components/Footer.tsx` (~línea 10-11) tiene props con defaults hardcodeados en inglés:
```tsx
// location = "Berlin - Private Studio"
// copyright = "Copyright 2026 Akemi Tattoo"
```
El año 2026 quedará obsoleto y el texto no es traducible.

**Qué hacer:**
- El año debe calcularse dinámicamente: `new Date().getFullYear()`
- El texto "Copyright" y la estructura deben venir del diccionario
- `location` viene de los datos del artista, no necesita traducción

**Archivos afectados:**
- `components/Footer.tsx`
- `lib/i18n.ts`

---

## 3. Colores — Hardcoding vs variables CSS

### 3.1 — LocationSearch usa colores hardcodeados rompiendo el sistema de temas

**Prioridad:** 🔴 Alta  
**Tipo:** Visual / Temas

**Problema:** `components/studio/LocationSearch.tsx:134` usa clases Tailwind hardcodeadas (`border-black`, `bg-white`, `text-black`, `hover:bg-black`, `hover:text-white`) y `shadow-[2px_2px_0_#000]`. Esto hace que el dropdown de ubicación siempre se vea en blanco y negro, sin importar el tema activo.

**Qué hacer:**  
Reemplazar las clases hardcodeadas con las variables CSS del sistema de temas:
```tsx
// ACTUAL:
"border border-black bg-white text-black hover:bg-black hover:text-white"

// CORRECTO:
"border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
```

**Archivos afectados:**
- `components/studio/LocationSearch.tsx` — todas las clases de color del dropdown

---

### 3.2 — Hex hardcodeados en globals.css para select nativo

**Prioridad:** 🟢 Baja  
**Tipo:** CSS / Temas

**Problema:** `app/globals.css:387-395` tiene `#ffffff` y `#000000` en la regla del `.gallery-filter-select`. Estos son necesarios por limitaciones del elemento `<select>` nativo, pero podrían usar las variables:

```css
/* Líneas ~387-395 */
background: var(--bg);
color: var(--fg);
```

**Nota:** La compatibilidad con `<select>` styling varía por navegador/OS. Verificar antes de mergear.

**Archivos afectados:**
- `app/globals.css`

---

## 4. Espaciado y Radios — Inconsistencias

### 4.1 — Border radius inconsistente en BookingForm

**Prioridad:** 🟡 Media  
**Tipo:** Visual

**Problema:** Dentro de `BookingForm.tsx`, los botones de fecha usan `rounded-lg` (8px) y los slots usan `rounded-xl` (12px). No hay razón visual para esta diferencia.

| Elemento | Línea approx. | Clase actual |
|---|---|---|
| Slot button | ~143 | `rounded-xl` |
| Date nav button | ~157 | `rounded-lg` |

**Qué hacer:** Unificar en `rounded-xl` para mantener coherencia con el resto de la UI pública, o consumir una variable `--radius-button` del tema activo.

**Archivos afectados:**
- `components/BookingForm.tsx`

---

### 4.2 — PostFeed y GalleryGrid con radius inconsistente entre sí

**Prioridad:** 🟢 Baja  
**Tipo:** Visual

`PostFeed.tsx:62` usa `rounded-xl` en cards. `GalleryGrid.tsx` usa `.hard-border` (sin radius). Esto es intencional por tema, pero si se usa el mismo tema para ambos en la misma página, puede quedar inconsistente. Documentar que el radius debe seguir la variable `--radius` del tema activo.

**Archivos afectados:**
- `app/globals.css` — verificar que `--radius` está definido por tema
- `components/PostFeed.tsx`
- `components/GalleryGrid.tsx`

---

### 4.3 — Padding inconsistente en inputs de formularios

**Prioridad:** 🟡 Media  
**Tipo:** Visual

`BookingForm.tsx` mezcla `p-4` (16px) y `px-3 py-1.5` (12px/6px) para elementos del mismo nivel visual. Unificar usando las clases de admin input o definir nuevas utilidades públicas en `globals.css`.

**Archivos afectados:**
- `components/BookingForm.tsx`
- `components/ContactForm.tsx`
- `app/globals.css` — posible adición de `.public-input` utility class

---

## 5. Accesibilidad — Focus, ARIA, Contraste

### 5.1 — Agregar focus-visible a todos los elementos interactivos del sitio público

**Prioridad:** 🔴 Alta  
**Tipo:** Accesibilidad (WCAG 2.4.7)

**Problema:** El sitio público no tiene estilos de `:focus-visible` en botones, links y cards interactivas. Los usuarios que navegan con teclado o lectores de pantalla no pueden ver qué elemento tiene el foco.

**Qué hacer:**  
Agregar en `app/globals.css` una regla global para el sitio público:

```css
/* Focus visible — public site */
.public-site :focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

O más granularmente por componente usando `focus-visible:ring-2 focus-visible:ring-[var(--accent)]`.

**Archivos afectados:**
- `app/globals.css` — agregar regla global
- `components/BookingForm.tsx` — botones y inputs
- `components/ContactForm.tsx` — inputs y submit
- `components/GalleryGrid.tsx` — cards clickeables
- `components/PostFeed.tsx` — cards clickeables
- `components/headers/NavAtelier.tsx`
- `components/headers/NavMono.tsx`
- `components/headers/NavInk.tsx`
- `components/headers/NavVerdure.tsx`
- `components/headers/NavAmber.tsx`
- `components/SitePreferencesMenu.tsx`
- `components/PaymentButtons.tsx`

---

### 5.2 — ARIA labels faltantes en botones de acción

**Prioridad:** 🔴 Alta  
**Tipo:** Accesibilidad (WCAG 4.1.2)

**Problema:** Varios botones carecen de nombre accesible:

| Componente | Línea approx. | Problema |
|---|---|---|
| `SitePreferencesMenu.tsx` | ~114-125 | Botón toggle del dropdown sin `aria-label` |
| `PaymentButtons.tsx` | ~56 | Botones de pago sin `aria-label` descriptivo |
| `BookingForm.tsx` | ~275-282 | Submit sin `aria-label` (aunque tiene texto visible) |

**Qué hacer:**
```tsx
// SitePreferencesMenu — botón toggle:
<button aria-label={dict.a11y.openPreferences} aria-expanded={isOpen} ...>

// PaymentButtons — botones de pago:
<button aria-label={`Pay with ${provider}`} ...>
```

**Archivos afectados:**
- `components/SitePreferencesMenu.tsx`
- `components/PaymentButtons.tsx`
- `lib/i18n.ts` — agregar keys de a11y si no existen

---

### 5.3 — Asociar mensajes de error a inputs vía aria-describedby

**Prioridad:** 🔴 Alta  
**Tipo:** Accesibilidad (WCAG 1.3.1)

**Problema:** Los campos de formulario con error no tienen `aria-invalid` ni `aria-describedby` apuntando al mensaje de error. Los lectores de pantalla no anuncian el error.

**Qué hacer:**
```tsx
// Antes:
<input className={errors.name ? "input-error" : ""} />
<p>{errors.name}</p>

// Después:
<input
  id="field-name"
  aria-invalid={!!errors.name}
  aria-describedby={errors.name ? "error-name" : undefined}
  className={errors.name ? "input-error" : ""}
/>
{errors.name && <p id="error-name" role="alert">{errors.name}</p>}
```

**Archivos afectados:**
- `components/BookingForm.tsx` — campos name, email, placement
- `components/ContactForm.tsx` — todos los campos con validación

---

### 5.4 — Cards clickeables: usar `<button>` en lugar de `<article role="button">`

**Prioridad:** 🟡 Media  
**Tipo:** Accesibilidad / HTML semántico

**Problema:** `GalleryGrid.tsx` y `PostFeed.tsx` usan `<article role="button" onClick onKeyDown>`. Aunque parcialmente accesible, la práctica correcta es un `<button>` con `display:contents` o un wrapper apropiado, para soporte nativo de Enter/Space y anuncio correcto en screen readers.

**Qué hacer:**
```tsx
// Opción: envolver en button con estilo reset
<button
  type="button"
  onClick={...}
  className="w-full text-left appearance-none bg-transparent border-0 p-0"
>
  <article>...</article>
</button>
```

**Archivos afectados:**
- `components/GalleryGrid.tsx`
- `components/PostFeed.tsx`

---

### 5.5 — Contraste: texto con opacity baja puede no cumplir WCAG AA

**Prioridad:** 🟡 Media  
**Tipo:** Accesibilidad (WCAG 1.4.3)

**Problema:** Varios textos usan `opacity-40`, `opacity-60`, `opacity-75` que reducen el contraste efectivo. En temas claros esto puede caer por debajo de 4.5:1 ratio.

| Componente | Línea approx. | Clase | Riesgo |
|---|---|---|---|
| `BookingForm.tsx` | ~159 | `opacity-60` | Medio |
| `GalleryGrid.tsx` | ~131 | `opacity-40` | **Alto** |
| `PostFeed.tsx` | ~73 | `opacity-75` | Bajo |

**Qué hacer:**  
- Reemplazar `opacity-*` con colores semitransparentes como variables de tema: `--muted` ya está definido en algunos temas.
- Usar `text-[var(--muted)]` en lugar de `text-[var(--fg)] opacity-40`.

**Archivos afectados:**
- `components/BookingForm.tsx`
- `components/GalleryGrid.tsx`
- `components/PostFeed.tsx`
- `app/globals.css` — verificar que todos los temas definen `--muted` con contraste suficiente

---

## 6. UX — Estados vacíos, error, hover, disabled

### 6.1 — Agregar estados hover a inputs de formularios

**Prioridad:** 🟡 Media  
**Tipo:** UX / Feedback visual

**Problema:** Los inputs de `BookingForm.tsx` y `ContactForm.tsx` no tienen estado hover. El usuario no recibe feedback visual al acercarse a un campo.

**Qué hacer:**
```tsx
// Ejemplo para inputs públicos:
"border-[var(--fg)] hover:border-[var(--accent)] focus:border-[var(--accent)] transition-colors duration-150"
```

O agregar a `app/globals.css` una clase `.public-input` con estos estados.

**Archivos afectados:**
- `components/BookingForm.tsx`
- `components/ContactForm.tsx`
- `app/globals.css` — posible `.public-input` utility

---

### 6.2 — Agregar feedback visual a botones disabled

**Prioridad:** 🟡 Media  
**Tipo:** UX

**Problema:** Los botones con `disabled` no tienen estilo visual que comunique el estado. En `BookingForm.tsx` el botón submit puede estar deshabilitado sin que el usuario lo note.

**Qué hacer:**
```tsx
// Agregar a clases de botones:
"disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
```

**Archivos afectados:**
- `components/BookingForm.tsx`
- `components/PaymentButtons.tsx`
- `app/globals.css` — si hay clase `.theme-button` o similar para generalizar

---

### 6.3 — Estado de error para LocationSearch API failure

**Prioridad:** 🟡 Media  
**Tipo:** UX

**Problema:** `components/studio/LocationSearch.tsx:73-74` falla silenciosamente si la API de Nominatim no responde. El usuario no sabe si hubo un error o si simplemente no hay resultados.

**Qué hacer:**  
Agregar estado de error y mostrar mensaje al usuario:
```tsx
const [error, setError] = useState<string | null>(null);
// en catch:
setError("Could not search locations. Try again.");
// en render:
{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
```

**Archivos afectados:**
- `components/studio/LocationSearch.tsx`

---

### 6.4 — Estado de error para PostFeed si el fetch falla

**Prioridad:** 🟡 Media  
**Tipo:** UX

**Problema:** `components/PostFeed.tsx` no tiene estado de error visible si la carga de posts falla en runtime (SSR error boundado, pero no hay UI de fallback).

**Qué hacer:**  
Agregar un error boundary o verificar que el componente padre maneje el error con UI apropiada. Si los posts se cargan client-side, agregar `try/catch` con estado de error.

**Archivos afectados:**
- `components/PostFeed.tsx`
- El page que lo consume en `app/`

---

### 6.5 — Animación/feedback de éxito en booking y contacto

**Prioridad:** 🟢 Baja  
**Tipo:** UX / Delight

**Problema:** Tras enviar el formulario de booking o contacto, el mensaje de éxito aparece sin animación. La transición es abrupta.

**Qué hacer:**  
Usar Framer Motion (ya en el proyecto via `Reveal.tsx`) para animar la entrada del mensaje de éxito:
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  className="validation-box success"
>
  {dict.booking.successMessage}
</motion.div>
```

**Archivos afectados:**
- `components/BookingForm.tsx`
- `components/ContactForm.tsx`

---

### 6.6 — Confirmar acciones destructivas en managers de admin/studio

**Prioridad:** 🟡 Media  
**Tipo:** UX / Seguridad

**Problema:** Las acciones de borrado en los managers de admin/studio no parecen tener un diálogo de confirmación visible.

**Qué hacer:**  
Agregar un `window.confirm()` o un modal de confirmación antes de ejecutar deletes. El modal es preferible para consistencia visual.

**Archivos afectados:**
- `components/admin/GalleryManager.tsx`
- `components/studio/StudioGalleryManager.tsx`
- `components/studio/StudioPostManager.tsx`
- Otros managers que implementen delete

---

## 7. Formularios — Validación y feedback

### 7.1 — Mensajes de error no son user-friendly (muestran nombre de campo técnico)

**Prioridad:** 🔴 Alta  
**Tipo:** UX / Copy

**Problema:** `BookingForm.tsx` muestra errores con el path del campo prefijado: `"name: Field is required"`, `"email: Invalid format"`. El usuario ve texto técnico.

**Líneas afectadas en `components/BookingForm.tsx`:**
- ~228: `"name: {error}"`
- ~235: `"email: {error}"`  
- ~262: `"placement: {error}"`

**Qué hacer:**  
Los mensajes de error deben ser solo el texto del error, sin el nombre de campo. El nombre del campo ya está visible en el label:
```tsx
// ACTUAL:
{errors.name && <p className="input-helper">{`name: ${errors.name}`}</p>}

// CORRECTO:
{errors.name && <p className="input-helper" id="error-name">{errors.name}</p>}
```

Además, los mensajes de error deben estar en el diccionario de i18n.

**Archivos afectados:**
- `components/BookingForm.tsx`
- `lib/i18n.ts` — keys de validación

---

### 7.2 — ContactForm sin indicador de loading visual

**Prioridad:** 🟡 Media  
**Tipo:** UX

**Problema:** `ContactForm.tsx` cambia el texto del botón a "Sending..." durante el envío pero no hay indicador visual adicional (spinner, skeleton, etc.). En conexiones lentas el usuario puede pensar que el botón no respondió.

**Qué hacer:**  
Agregar un spinner inline o deshabilitar el botón con estilo visual claro durante `isSubmitting`.

**Archivos afectados:**
- `components/ContactForm.tsx`

---

## 8. Calidad de código CSS

### 8.1 — Variable CSS con referencia circular en font-heading

**Prioridad:** 🟢 Baja  
**Tipo:** Bug CSS

**Problema:** `app/globals.css:14` define `--font-heading` incluyendo `var(--font-heading)` en su propio valor, creando una referencia circular:

```css
/* ACTUAL (circular): */
--font-heading: "Druk Wide", "Founders Grotesk Condensed", var(--font-heading), sans-serif;

/* CORRECTO: */
--font-heading: "Druk Wide", "Founders Grotesk Condensed", sans-serif;
```

El `var(--font-heading)` en el medio no tiene utilidad porque la variable se está definiendo en ese mismo lugar. La fuente de Next.js ya está disponible como variable de layout; se puede referenciar directamente si es necesario.

**Archivos afectados:**
- `app/globals.css` — línea ~14

---

### 8.2 — Agregar utilidades de transición consistentes para el sitio público

**Prioridad:** 🟢 Baja  
**Tipo:** CSS / Mantenibilidad

**Problema:** Las transiciones en componentes públicos usan duraciones y easings hardcodeados distintos (`160ms`, `200ms`, `300ms`, `600ms` en Ink). Los temas ya definen `--transition-dur` y `--ease` en algunos casos pero no se usa consistentemente.

**Qué hacer:**  
Verificar que todos los temas en `globals.css` definen `--transition-dur` y `--ease`, y que los componentes públicos los consumen:
```tsx
// En lugar de:
"transition-all duration-200 ease-out"
// Usar variable del tema:
style={{ transition: `all var(--transition-dur) var(--ease)` }}
// O crear clase Tailwind custom via @theme
```

**Archivos afectados:**
- `app/globals.css` — verificar definición por tema
- `components/BookingForm.tsx`
- `components/ContactForm.tsx`
- `components/GalleryGrid.tsx`
- `components/PostFeed.tsx`

---

## Resumen de Pendientes por Prioridad

### 🔴 Alta — Bloqueante o visible para usuarios finales

| # | Tarea | Archivos Clave |
|---|---|---|
| 1.1 | Crear escala tipográfica en CSS variables | `globals.css` |
| 1.2 | Normalizar tamaños de título en headers | `headers/*.tsx` |
| 2.1 | Traducir strings hardcodeados en componentes públicos | `GalleryGrid`, `PostFeed`, `NavMono` |
| 2.2 | Localizar arrays de meses/días (Spanish-only) | `BookingForm`, `StudioAvailabilityManager` |
| 3.1 | LocationSearch: reemplazar colores hardcodeados por variables CSS | `LocationSearch.tsx` |
| 5.1 | Agregar focus-visible a todos los interactivos del sitio público | `globals.css`, todos los componentes públicos |
| 5.2 | Agregar aria-labels faltantes en botones | `SitePreferencesMenu`, `PaymentButtons` |
| 5.3 | Asociar mensajes de error a inputs con aria-describedby | `BookingForm`, `ContactForm` |
| 7.1 | Corregir mensajes de error (eliminar prefijo de nombre de campo) | `BookingForm` |

### 🟡 Media — UX y Diseño

| # | Tarea | Archivos Clave |
|---|---|---|
| 1.3 | Normalizar eyebrow text-[9px] → text-[10px] en NavInk | `NavInk.tsx` |
| 1.4 | Normalizar letter-spacing de eyebrow | `NavInk.tsx`, `GalleryGrid.tsx` |
| 2.3 | Traducir strings del studio | `LocationSearch`, `StudioPostManager` |
| 2.4 | Footer: año dinámico + copyright traducible | `Footer.tsx`, `i18n.ts` |
| 4.1 | Unificar border-radius en BookingForm | `BookingForm.tsx` |
| 4.3 | Unificar padding en inputs de formularios | `BookingForm`, `ContactForm` |
| 5.4 | Cards: usar `<button>` en lugar de `<article role="button">` | `GalleryGrid`, `PostFeed` |
| 5.5 | Reemplazar opacity-* baja por variable --muted | `GalleryGrid`, `BookingForm`, `PostFeed` |
| 6.1 | Agregar hover states a inputs | `BookingForm`, `ContactForm` |
| 6.2 | Estilar visualmente botones disabled | `BookingForm`, `PaymentButtons` |
| 6.3 | Error state en LocationSearch API failure | `LocationSearch.tsx` |
| 6.4 | Error state en PostFeed | `PostFeed.tsx` |
| 6.6 | Confirmación antes de borrar en managers | `GalleryManager`, `StudioGalleryManager` |
| 7.2 | Loading spinner en ContactForm | `ContactForm.tsx` |

### 🟢 Baja — Pulido y calidad

| # | Tarea | Archivos Clave |
|---|---|---|
| 4.2 | Documentar radius por tema en globals.css | `globals.css` |
| 6.5 | Animación de éxito en booking/contact | `BookingForm`, `ContactForm` |
| 8.1 | Corregir referencia circular en --font-heading | `globals.css:14` |
| 8.2 | Usar variables CSS de transición en componentes públicos | `globals.css`, varios |
| 3.2 | Reemplazar hex hardcodeados en gallery-filter-select | `globals.css:387-395` |

---

## Convenciones para Pull Requests

Cada PR debe:
- Referenciar el número de ítem de este plan (ej: `fix: 2.1 — translate hardcoded strings in GalleryGrid`)
- Incluir screenshots o video del antes/después para cambios visuales
- Verificar que no rompe los demás temas de artista (Atelier, Mono, Ink, Verdure, Amber + variantes B)
- Pasar TypeScript sin errores
- Para cambios de i18n, incluir las tres keys (`en`, `es`, `de`)
