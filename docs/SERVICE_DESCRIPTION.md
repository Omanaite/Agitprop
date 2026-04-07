# Agitprop — Descripción del Servicio

## Qué es Agitprop

Agitprop es una plataforma web gratuita diseñada para apoyar a artistas independientes,
tatuadores, ilustradores y creadores visuales. Permite a cada artista tener su propio
sitio web profesional sin conocimientos técnicos, administrado desde un panel simple.

El nombre proviene del arte político de vanguardia — agitación + propaganda — como
tributo a la tradición del arte como herramienta de comunicación directa.

---

## Qué entrega el servicio

### Para el artista (usuario del estudio)
- **Sitio web público personalizado** con URL propia (`agitpropstudio.vercel.app/su-nombre`)
- **Galería de trabajo** con imágenes, etiquetas, duración de sesión y notas
- **Sistema de booking** — los clientes pueden solicitar sesiones directamente desde la web
- **Posts / notas de estudio** — el artista publica actualizaciones, proceso, reflexiones
- **Tarifas y disponibilidad** — configurables desde el panel
- **Temas visuales** — múltiples estilos de diseño para la web pública
- **Panel de administración (Studio)** — gestión completa sin tocar código
- **Notificaciones por email** — aviso al artista cuando llega un booking o mensaje

### Para el cliente del artista (visitante de la web)
- Ver el portfolio del artista
- Solicitar una sesión de tatuaje o servicio artístico
- Contactar directamente al artista

---

## Modelo de sostenibilidad

Agitprop es un proyecto personal sin fines de lucro. El código, el desarrollo
y el mantenimiento son aportados voluntariamente por el creador del proyecto.

### Costos reales del servicio
| Servicio | Costo mensual | Cubierto por |
|---|---|---|
| Vercel (hosting) | $0 (plan gratuito) | Proyecto |
| Supabase (base de datos) | $0 (plan gratuito) | Proyecto |
| Supabase Pro (al escalar) | ~$25/mes | Donaciones de la comunidad |
| Dominio | ~$15/año | Proyecto |

### El límite real: almacenamiento
El plan gratuito de Supabase incluye **1 GB de almacenamiento** para imágenes.
Con ~500 KB por foto promedio y 25 fotos por artista básico, el sistema soporta
aproximadamente **80 artistas** antes de necesitar upgrade a Supabase Pro.

### Dos niveles de uso

**Estudio Básico (gratuito, siempre)**
- Hasta 2 galerías
- Hasta 25 piezas en total
- Hasta 5 posts publicados
- Todos los temas visuales incluidos
- Booking y contacto ilimitados
- Sin costo, sin tarjeta de crédito, sin fecha de vencimiento

**Estudio Ampliado (contribuidor)**
- Galerías, piezas y posts ilimitados
- Dominio personalizado
- Integraciones (WhatsApp, Telegram, pagos)
- El artista contribuye voluntariamente a los costos de hosting
- No es una suscripción comercial — es una donación con acceso extendido

### Donaciones voluntarias
Los artistas que encuentren valor en el servicio pueden apoyar el proyecto
mediante donación voluntaria a la cuenta PayPal del mantenedor. No hay monto
mínimo ni obligación. Los donantes con Estudio Ampliado pueden solicitar
mejoras o personalizaciones — el mantenedor las evalúa caso a caso.

---

## Qué NO es Agitprop

- No es una empresa ni un SaaS comercial
- No cobra comisiones sobre ventas de los artistas
- No vende datos de usuarios a terceros
- No tiene publicidad
- No garantiza disponibilidad comercial (uptime SLA)

---

## Tecnología

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel
- **Email**: Resend
- **Código**: Open source, repositorio privado en GitHub

---

## Contacto y soporte

El proyecto es mantenido por Pablo Chandía.
Para soporte, sugerencias o reportar problemas, contactar directamente al mantenedor.

*Documento creado: 2026-04-07*
*Uso: base para redacción de Términos y Condiciones del servicio*
