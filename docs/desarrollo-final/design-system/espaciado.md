# 📐 WhatsSound — Espaciado y Grid

> **Principio:** Sistema de 4px base. Consistencia > creatividad en spacing.

---

## Escala de Espaciado (base 4px)

| Token | Valor | Uso |
|-------|-------|-----|
| `space-0` | 0px | — |
| `space-1` | 4px | Separación mínima (icono-texto inline) |
| `space-2` | 8px | Padding interno de badges, gap entre elementos tiny |
| `space-3` | 12px | Padding horizontal de chips, gap de lista |
| `space-4` | 16px | Padding estándar de cards y containers |
| `space-5` | 20px | Margen entre secciones relacionadas |
| `space-6` | 24px | Padding horizontal de pantalla |
| `space-8` | 32px | Separación entre secciones |
| `space-10` | 40px | Espaciado grande (entre bloques) |
| `space-12` | 48px | Altura de items de lista |
| `space-16` | 64px | Header height |
| `space-20` | 80px | Espaciado extra grande |

---

## Layout de Pantalla

| Elemento | Valor |
|----------|-------|
| **Padding horizontal** | 16px (24px en tablets) |
| **Safe area top** | Status bar height + 0px |
| **Header height** | 56px (estándar) / 64px (con subtítulo) |
| **Tab bar height** | 48px + safe area bottom |
| **Bottom nav height** | 56px + safe area bottom |
| **FAB position** | 16px desde bottom-right |
| **FAB size** | 56px × 56px |

---

## Bordes y Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-xs` | 4px | Chips, badges pequeños |
| `radius-sm` | 8px | Inputs, botones, cards |
| `radius-md` | 12px | Cards destacadas, modales |
| `radius-lg` | 16px | Bottom sheets, containers principales |
| `radius-xl` | 20px | Burbuja de chat (esquinas externas) |
| `radius-full` | 50% | Avatares, FAB, dots |
| `radius-bubble-sent` | 8px 0px 8px 8px | Burbuja enviada (pico arriba-derecha) |
| `radius-bubble-received` | 0px 8px 8px 8px | Burbuja recibida (pico arriba-izquierda) |

---

## Bordes

| Token | Valor | Uso |
|-------|-------|-----|
| `border-default` | 1px solid `#2A3942` | Separadores de lista, inputs |
| `border-active` | 2px solid `#25D366` | Input activo, tab seleccionado |
| `border-none` | 0px | Cards flotantes, botones filled |
| `divider` | 0.5px solid `#2A3942` | Línea divisoria en listas |

---

## Grid de Lista

| Tipo | Altura | Padding | Icono |
|------|--------|---------|-------|
| **Lista simple** | 48px | 16px horizontal | — |
| **Lista con avatar** | 56px | 16px horizontal | 40px avatar |
| **Lista con subtexto** | 72px | 16px horizontal | 40px avatar |
| **Lista de canción** | 64px | 16px horizontal | 48px portada |
| **Item de ajustes** | 52px | 16px horizontal | 24px icono |

---

## Reglas

1. **Solo usar valores de la escala** — nunca 5px, 7px, 13px, etc.
2. **Padding de pantalla siempre 16px** — nunca varía por pantalla
3. **Gap entre cards: 8px**, entre secciones: 32px
4. **Dividers: full-width o indent 72px** (alineado con texto tras avatar)
5. **Touch targets mínimo 44×44px** (accesibilidad)
