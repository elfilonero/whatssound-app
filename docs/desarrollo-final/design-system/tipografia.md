# 🔤 WhatsSound — Tipografía

> **Principio:** Legibilidad ante todo. La tipografía debe sentirse como WhatsApp pero con personalidad musical en momentos clave.

---

## Familias Tipográficas

| Plataforma | Familia Principal | Fallback |
|------------|-------------------|----------|
| **iOS** | SF Pro Text / SF Pro Display | -apple-system, Helvetica Neue |
| **Android** | Roboto | Noto Sans, sans-serif |
| **Web** | Inter | -apple-system, Roboto, sans-serif |

> **Nota:** Usar SF Pro Display para tamaños ≥20px, SF Pro Text para <20px (en iOS).

---

## Escala Tipográfica

### Títulos y Headers

| Token | Tamaño | Peso | Line Height | Uso |
|-------|--------|------|-------------|-----|
| `display-lg` | 28px | Bold (700) | 34px | Splash screen, onboarding |
| `display-md` | 24px | Bold (700) | 30px | Título de sección principal |
| `heading-lg` | 20px | SemiBold (600) | 26px | Header de pantalla (ej. "WhatsSound") |
| `heading-md` | 18px | SemiBold (600) | 24px | Nombre de sesión, títulos de card |
| `heading-sm` | 16px | SemiBold (600) | 22px | Subtítulos de sección |

### Cuerpo

| Token | Tamaño | Peso | Line Height | Uso |
|-------|--------|------|-------------|-----|
| `body-lg` | 16px | Regular (400) | 22px | Texto de chat, contenido principal |
| `body-md` | 14px | Regular (400) | 20px | Descripciones, texto secundario |
| `body-sm` | 13px | Regular (400) | 18px | Timestamps, metadata |
| `body-xs` | 11px | Regular (400) | 16px | Badges, labels pequeños |

### Especiales

| Token | Tamaño | Peso | Line Height | Uso |
|-------|--------|------|-------------|-----|
| `label-md` | 14px | Medium (500) | 18px | Labels de tabs, botones |
| `label-sm` | 12px | Medium (500) | 16px | Labels secundarios, contadores |
| `caption` | 11px | Regular (400) | 14px | Hints, notas al pie |
| `overline` | 10px | SemiBold (600) | 14px | Sección headers (LETRA MAYÚSCULA) |
| `counter` | 12px | Bold (700) | 12px | Badge numérico (notificaciones) |
| `song-title` | 15px | SemiBold (600) | 20px | Nombre de canción en cola/player |
| `song-artist` | 13px | Regular (400) | 18px | Artista de canción |

---

## Pesos Disponibles

| Peso | Valor | Uso |
|------|-------|-----|
| Regular | 400 | Texto de cuerpo, descripciones |
| Medium | 500 | Labels, botones, tabs |
| SemiBold | 600 | Headers, títulos, nombres |
| Bold | 700 | Display titles, badges, counters |

---

## Reglas de Uso

1. **Máximo 3 tamaños por pantalla** — reduce ruido visual
2. **Nunca usar Light (300)** en dark mode — poca legibilidad
3. **Tamaño mínimo: 11px** — nada más pequeño
4. **Chat usa 16px** siempre — igual que WhatsApp, es el sweet spot
5. **Nombres de usuario en SemiBold**, mensajes en Regular
6. **Timestamps y metadata en `#8696A0`** (texto secundario)
7. **Letter-spacing: 0** para todo excepto `overline` (+1px)
8. **Emojis:** Usar emoji nativo del sistema, tamaño 1.2x del texto circundante
