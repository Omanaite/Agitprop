# Storage Tiers — Agitprop

## Por qué existen los tiers

Agitprop es gratuito para todos. El único límite real es el almacenamiento:
Supabase cobra por espacio en disco. Los límites del tier básico reflejan
el presupuesto real disponible en el plan gratuito, no una estrategia comercial.

## Tier básico (por defecto, gratis)

| Límite | Valor | Justificación |
|---|---|---|
| Galerías | 2 | Portfolio enfocado |
| Piezas totales | 25 | ~12.5 MB por artista a 500 KB/foto |
| Posts | 5 | Uso de texto mínimo |
| Dominio propio | No | Costo de infraestructura DNS |
| Integraciones | No | Costo de APIs externas |
| Temas visuales | Todos | El diseño no cuesta espacio |

**Espacio estimado por artista básico: ~12-15 MB**
**Capacidad del plan gratuito Supabase: ~80 artistas básicos**

## Tier expandido (contribuidor)

Sin límites de almacenamiento. El artista contribuye voluntariamente
a los costos de hosting mediante donación.

**Precio sugerido**: lo que el artista considere justo para cubrir su uso.
**Costo real de Supabase Pro**: $25/mes para 8 GB (suficiente para ~600 artistas básicos).

## Migración de base de datos

La columna `plan_code` en `artist_tenants` usa:
- `"basic"` → tier básico (antes: `"free"`)
- `"expanded"` → tier expandido (antes: `"premium"`)

Los valores legacy `"free"` y `"premium"` son normalizados automáticamente en el código.

## Reglas en el código

Ver `lib/tenants/plan.ts` — todas las reglas de límites están centralizadas ahí.
Las funciones principales:
- `canAddGallery(planCode, currentCount)`
- `canAddPost(planCode, currentCount)`
- `canAddGalleryItem(planCode, currentCount)`
- `hasFeature(planCode, feature)`
