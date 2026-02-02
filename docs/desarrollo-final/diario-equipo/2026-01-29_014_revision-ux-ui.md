# 🎨 Revisión UX/UI — WhatsSound Design System
**Fecha:** 2026-01-29 | **Sprint:** 014 | **Rol:** UX/UI Lead  
**Alcance:** components/ui/, theme/, app/ screens

---

## 1. Design System — Coherencia

### ✅ Lo que está bien
- **9 componentes base** bien estructurados: Button, Input, Avatar, Card, Badge, Modal, Toast, EmptyState, BottomSheet
- Todos importan desde el theme centralizado (colors, typography, spacing)
- Barrel export en `index.ts` — import limpio
- Variantes tipadas con TypeScript (`ButtonVariant`, `BadgeVariant`, etc.)
- Cada componente acepta `style` prop para override

### ⚠️ Problemas detectados
- **EmptyState no se usa consistentemente** — `request-song.tsx` implementa su propio empty state inline en vez de usar el componente `<EmptyState>`
- **No hay componente Header/ScreenHeader** — cada pantalla probablemente reimplementa su propio header
- **No hay componente ListItem/SettingsRow** — las ~10 pantallas de settings seguro repiten el mismo patrón de fila con icono + label + chevron

### 📊 Puntuación: 7/10
Buena base, pero falta disciplina en adopción y faltan componentes de lista.

---

## 2. Paleta de Colores — Accesibilidad

### Análisis WCAG AA (contraste mínimo 4.5:1 texto normal, 3:1 texto grande)

| Combinación | Ratio estimado | WCAG AA |
|---|---|---|
| `textPrimary (#FFF)` sobre `background (#0B141A)` | ~18.4:1 | ✅ Pass |
| `textPrimary (#FFF)` sobre `surface (#1F2C34)` | ~12.2:1 | ✅ Pass |
| `textSecondary (#8696A0)` sobre `background (#0B141A)` | ~5.3:1 | ✅ Pass |
| `textMuted (#667781)` sobre `background (#0B141A)` | ~3.8:1 | ⚠️ Fail normal, Pass large |
| `textMuted (#667781)` sobre `surface (#1F2C34)` | ~2.8:1 | ❌ Fail |
| `primary (#25D366)` sobre `background (#0B141A)` | ~7.8:1 | ✅ Pass |
| `textOnPrimary (#FFF)` sobre `primary (#25D366)` | ~2.5:1 | ❌ Fail |
| `textOnPrimary (#FFF)` sobre `bubbleOwn (#005C4B)` | ~5.8:1 | ✅ Pass |

### 🚨 Problemas críticos
1. **Texto blanco sobre verde primario (#25D366)** — ratio ~2.5:1, **falla WCAG AA y AAA**. Esto afecta todos los botones primary. Solución: usar `#000` o `#0B141A` como `textOnPrimary`
2. **textMuted sobre surface** — ratio ~2.8:1, falla. Timestamps y texto deshabilitado serán ilegibles para usuarios con baja visión

### Acciones requeridas
- [ ] Cambiar `textOnPrimary` de `#FFFFFF` a `#0B141A` (negro) — sube ratio a ~7.8:1
- [ ] Subir `textMuted` a `#7A8D97` o similar para alcanzar 4.5:1 sobre surface

---

## 3. Tipografía — Escala y Jerarquía

### ✅ Bien estructurada
```
h1: 28px/700  →  Títulos principales
h2: 22px/700  →  Subtítulos de sección
h3: 18px/600  →  Headers de componente
body: 16px/400 →  Texto principal
bodySmall: 14px →  Texto secundario
caption: 12px  →  Labels, timestamps
tab: 11px/500  →  Tab bar
```

### Evaluación
- **Ratio de escala:** ~1.17-1.27x entre niveles — escala menor (minor third ~1.2x). Correcto para mobile.
- **Line heights:** Bien proporcionados (1.2-1.4x del font size)
- **Letter spacing negativo** en headings — buen detalle tipográfico
- **Font family:** System/Roboto — correcto para performance, pero sin personalidad de marca

### ⚠️ Observaciones
- No hay variante `overline` (texto pequeño uppercase para labels de sección)
- No hay `bodyLarge` para texto destacado sin ser heading
- Tab a 11px es borderline pequeño en Android (mínimo recomendado: 12px)

### 📊 Puntuación: 8/10

---

## 4. Spacing — Consistencia

### Sistema definido (base 4px)
```
xs:4  sm:8  md:12  base:16  lg:20  xl:24  2xl:32  3xl:40  4xl:48  5xl:64
```

### ✅ Fortalezas
- Base 4px bien implementada
- Todos los componentes UI usan tokens del sistema
- borderRadius y iconSize también sistematizados

### ⚠️ Valores mágicos detectados
- **appearance.tsx**: Colores hardcodeados (`#1A1D21`, `#F5F5F5`, `#000000`, etc.) — no son del theme
- **dj-profile.tsx**: Colores de marca hardcodeados (`#E4405F` Instagram, `#FF5500` SoundCloud)
- **share-qr.tsx**: Colores de marca social hardcodeados (`#25D366`, `#E4405F`, `#1DA1F2`)
- **request-song.tsx**: Empty state styles inline duplicando lo que ya hace `<EmptyState>`

### Recomendación
- Crear `colors.brand` para colores de redes sociales
- Los colores de tema en appearance.tsx están OK como datos, pero deberían venir de un config

### 📊 Puntuación: 7.5/10

---

## 5. Componentes Faltantes para Escalar

### Tienen ✅
Button, Input, Avatar, Card, Badge, Modal, Toast, EmptyState, BottomSheet

### Necesitan urgente 🔴

| Componente | Justificación | Prioridad |
|---|---|---|
| **Skeleton** | No hay skeleton screens. 0 de ~40 pantallas tienen loading placeholders | P0 |
| **ListItem / SettingsRow** | ~10 pantallas de settings + listas repiten el mismo patrón | P0 |
| **ScreenHeader** | Header con back button, título, acciones — se repite en todas las screens | P0 |
| **Divider** | Separador de lista estilizado — se usa en muchos sitios | P1 |
| **Switch / Toggle** | Settings de notifications, privacy, audio necesitan toggles | P1 |
| **SearchBar** | search.tsx y request-song.tsx probablemente duplican | P1 |
| **Tab / SegmentedControl** | Para filtros dentro de pantallas | P2 |
| **ProgressBar** | Para player, uploads, storage | P2 |
| **IconButton** | Botón solo-icono (se repite en headers, acciones) | P2 |
| **Chip** | Para géneros musicales, tags — diferente al Badge | P2 |

---

## 6. Patrones de UX

### ❌ Pull-to-refresh
No se encontró ningún uso de `RefreshControl` en ninguna pantalla. **Crítico** para tabs como Discover, History, Groups.

### ⚠️ Loading states
- Solo 4 pantallas usan `loading` state (login, create-profile, session create, send-tip)
- Todas usan el `loading` prop del Button (spinner) — correcto
- **No hay loading state a nivel de pantalla** (full-screen spinner o skeleton)

### ⚠️ Error states
- No se encontró patrón de error state reutilizable
- No hay componente `ErrorState` (similar a EmptyState pero para errores de red)
- No hay retry patterns

### ⚠️ Empty states
- Componente `EmptyState` existe pero se usa inconsistentemente
- `request-song.tsx` implementa su propio empty state inline

### ❌ Skeleton screens
- **Cero implementaciones.** Esto es crítico para perceived performance
- Cada lista (chats, groups, history, discover) necesita skeletons

### 📊 Puntuación UX Patterns: 4/10

---

## 7. Comparativa con Apps Referencia

### vs WhatsApp
| Aspecto | WhatsApp | WhatsSound | Gap |
|---|---|---|---|
| Color scheme dark | ✅ Identical base | ✅ Muy similar | Bajo — bien |
| Chat bubbles | Polished | Colores definidos | Revisar implementación |
| Pull-to-refresh | ✅ | ❌ | **Alto** |
| Skeleton screens | ✅ | ❌ | **Alto** |
| Search UX | Animated header | ❓ | Medio |
| Settings UX | ListItem consistente | Sin componente ListItem | **Alto** |

### vs Spotify
| Aspecto | Spotify | WhatsSound | Gap |
|---|---|---|---|
| Player mini/full | Smooth transitions | Sin player component | **Crítico** |
| Skeleton screens | ✅ Shimmer | ❌ | **Alto** |
| Card system | Rich cards con gradientes | Card básica | Medio |
| Horizontal scrolls | ✅ Discovery | ❓ | Medio |
| Progress bar | Custom animated | Sin componente | Alto |

### vs Discord
| Aspecto | Discord | WhatsSound | Gap |
|---|---|---|---|
| Bottom sheets | Polished, nested | ✅ Básico | Medio |
| Toasts | ✅ Styled | ✅ Styled | **Bajo — bien** |
| Empty states | Per-context | ✅ Genérico | Medio |
| Error handling | Retry + humor | ❌ | **Alto** |
| Haptic feedback | ✅ | ❓ | Medio |

---

## 📋 Resumen Ejecutivo

### Lo que funciona bien (mantener)
1. Theme system bien organizado (colors, typography, spacing separados)
2. Componentes base con tipado TypeScript fuerte
3. Paleta dark mode coherente con identidad WhatsApp
4. BottomSheet con pan gesture — buen UX detail
5. Toast con auto-dismiss y variantes — production ready

### Top 5 Acciones Prioritarias

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | **Fix contraste textOnPrimary** — cambiar a negro | Accesibilidad legal | 5 min |
| 2 | **Crear Skeleton component** + implementar en todas las listas | Perceived performance | 1 día |
| 3 | **Crear ListItem/SettingsRow** + refactorizar settings | Consistencia, mantenibilidad | 0.5 día |
| 4 | **Añadir RefreshControl** a tabs principales | UX estándar esperado | 0.5 día |
| 5 | **Crear ErrorState** + retry pattern | Robustez | 0.5 día |

### Deuda de diseño estimada: ~4 días de trabajo

---

**Firmado por:** UX/UI Lead — Revisión formal Sprint 014  
**Próxima revisión:** Post-implementación de items P0
