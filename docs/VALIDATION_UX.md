# Validation UX Standards

## Objetivo
Estandarizar los mensajes de validación para admin y cliente con un estilo consistente y accesible.

## Principios
- Mensajes claros y accionables.
- Mismo lenguaje visual en todo el producto.
- Ubicación cercana al formulario.
- Compatible con dark mode y eye-rest mode.

## Estilo
- Contenedor: `validation-box`
- Lista de errores: `validation-list`
- Variantes:
  - `data-variant="error"` para fallos.
  - `data-variant="success"` para confirmaciones.

## Accesibilidad
- `aria-live="polite"` en mensajes y listas de error.
- No depender solo de color para comunicar estado.

## Alcance
- Admin: GalleryManager, PostManager
- Cliente: BookingForm, ContactForm

## API Contracts
Los endpoints de validación deben retornar:
```json
{
  "message": "Invalid payload.",
  "errors": [
    { "path": "field", "message": "reason" }
  ]
}
```
