# 🧩 WhatsSound — Catálogo de Componentes UI

> **Principio:** Atomic Design — átomos → moléculas → organismos. Cada componente reutilizable, consistente, documentado.

---

## 🔵 Átomos (Elementos Base)

### Button

| Variante | Fondo | Texto | Borde | Uso |
|----------|-------|-------|-------|-----|
| **Primary** | `#25D366` | `#FFFFFF` | none | CTA principal (Unirse, Crear sesión) |
| **Secondary** | `transparent` | `#25D366` | 1px `#25D366` | Acciones secundarias |
| **Ghost** | `transparent` | `#8696A0` | none | Acciones terciarias (Cancelar) |
| **Destructive** | `#F44336` | `#FFFFFF` | none | Eliminar, expulsar, cerrar sesión |
| **Icon Button** | `transparent` | `#8696A0` | none | Toolbar actions |

- **Tamaños:** SM (32px h), MD (44px h), LG (52px h)
- **Border radius:** 8px (rectangular), full (pill)
- **Estado disabled:** opacity 0.4

### Avatar

| Variante | Tamaño | Uso |
|----------|--------|-----|
| **XS** | 24px | Inline en chat, menciones |
| **SM** | 32px | Lista compacta |
| **MD** | 40px | Listas estándar, chat |
| **LG** | 56px | Headers de sesión |
| **XL** | 80px | Perfil, panel DJ |
| **2XL** | 120px | Editar perfil |

- **Forma:** Círculo siempre
- **Online dot:** 10px, `#25D366`, borde 2px `#0B141A`, posición bottom-right
- **Badge:** Superpuesto top-right (DJ ⭐, VIP 🔥, Mod 🛡)
- **Fallback:** Iniciales sobre fondo `#075E54`

### Badge / Chip

| Variante | Fondo | Texto | Uso |
|----------|-------|-------|-----|
| **Count** | `#25D366` | `#FFFFFF` | Notificaciones (3, 12, 99+) |
| **Role DJ** | `#FFD700` | `#000000` | Badge "DJ" |
| **Role VIP** | `#FF6B35` | `#FFFFFF` | Badge "VIP" |
| **Role Mod** | `#29B6F6` | `#FFFFFF` | Badge "MOD" |
| **Status** | `#25D366` | `#FFFFFF` | "EN VIVO", "CONECTADO" |
| **Genre** | `#2A3942` | `#E9EDEF` | "Reggaeton", "Pop" |

- **Tamaño:** height 20px, padding 4px 8px, radius 10px (pill)

### Toggle / Switch

- **Off:** Fondo `#2A3942`, thumb `#8696A0`
- **On:** Fondo `#25D366`, thumb `#FFFFFF`
- **Tamaño:** 48px × 28px

### Input / TextField

- **Fondo:** `#2A3942`
- **Texto:** `#E9EDEF`
- **Placeholder:** `#4A5D6A`
- **Borde focus:** 2px `#25D366`
- **Height:** 44px
- **Radius:** 8px (standard), 24px (chat input, search)
- **Variantes:** Default, Search (con lupa), Chat (con iconos adjuntar/emoji/enviar)

### Divider

- **Full width:** 0.5px `#2A3942`
- **Indented:** margin-left 72px (tras avatar de 40px + padding)

---

## 🟢 Moléculas (Componentes Compuestos)

### Chat Bubble

```
┌─────────────────────────┐
│ @NombreUsuario  ⭐ DJ   │  ← nombre + badge (solo en grupos)
│ Texto del mensaje       │
│              12:34 ✓✓   │  ← timestamp + read status
└─────────────────────────┘
```

| Propiedad | Enviada | Recibida | Sistema |
|-----------|---------|----------|---------|
| **Fondo** | `#005C4B` | `#1F2C34` | `#182229` centered |
| **Radius** | 8 0 8 8 | 0 8 8 8 | 8px all |
| **Max width** | 75% | 75% | 90% |
| **Nombre** | oculto | visible + color | — |

**Tipos especiales de burbuja:**
- **Canción compartida:** Mini card con portada 48px + título + artista + botón "Votar"
- **Waveform audio:** Barra de onda con play/pause + duración
- **Reacción rápida:** Emoji grande (48px) centrado

### Song Card (Item de Cola)

```
┌──────┬──────────────────────────┬─────┐
│ 🖼️  │ Nombre de la Canción     │ 🔥  │
│ 48px │ Artista — pedida por @X  │ 23  │
│      │ 🏅 #1 · ⏱ hace 5 min    │     │
└──────┴──────────────────────────┴─────┘
```

- **Portada:** 48px × 48px, radius 4px
- **Medalla:** 🥇🥈🥉 para top 3
- **Voto activo:** Icono `#25D366`, inactivo `#8696A0`
- **Con propina:** Borde izquierdo 3px `#FFD700`
- **Rechazada:** Opacity 0.5 + strikethrough + botón "Deshacer"

### Session Card (Landing)

```
┌────────────────────────────────────┐
│ 🖼️ Portada        DJ Nombre  🟢  │
│                    Reggaeton · 23👥│
│                    🎵 Canción...   │
│                    [Unirse]        │
└────────────────────────────────────┘
```

- **Fondo:** `#111B21`
- **Radius:** 12px
- **Portada:** 64px × 64px
- **Status:** 🟢 En vivo / 🔴 Cerrada

### User List Item

```
┌──────┬──────────────────────────┬─────┐
│  👤  │ Nombre         ⭐ VIP   │  ⋮  │
│ 40px │ Escuchando · 5 votos    │     │
└──────┴──────────────────────────┴─────┘
```

### Settings Item

```
┌──────┬──────────────────────────┬─────┐
│  🔒  │ Privacidad               │  >  │
│ 24px │ Última conexión, foto... │     │
└──────┴──────────────────────────┴─────┘
```

---

## 🔴 Organismos (Secciones de Pantalla)

### Header / App Bar

```
┌─ ← ──── WhatsSound ──── 🔍 ⋮ ─┐
```

- **Height:** 56px
- **Fondo:** `#1F2C34`
- **Título:** `heading-lg`, `#E9EDEF`
- **Iconos:** 24px, `#8696A0`

### Tab Bar (en sesión)

```
┌─ 🎵 Sonando ─ 💬 Chat ─ 📋 Cola ─ 👥 Gente ─┐
```

- **Height:** 48px
- **Activo:** texto `#25D366` + indicador 3px bottom
- **Inactivo:** texto `#8696A0`
- **Fondo:** `#1F2C34`

### Bottom Navigation (global)

```
┌─ 📡 En vivo ─ 👥 Grupos ─ 📞 Llamadas ─┐
```

- **Height:** 56px + safe area
- **Icono activo:** filled `#25D366`
- **Icono inactivo:** outlined `#8696A0`
- **Label:** 12px Medium

### Now Playing Mini Bar

```
┌─ 🖼️ Canción - Artista ───── ▶️ ⏭ ─┐
```

- **Height:** 56px
- **Fondo:** `#1F2C34`
- **Progress:** 2px line `#25D366` en top
- **Tappable:** expande a reproductor full

### Chat Input Bar

```
┌─ 😀 │ Escribe un mensaje...   │ 🎵 📷 🎤 ─┐
```

- **Height:** 48px (expande multi-line)
- **Fondo input:** `#2A3942`, radius 24px
- **Iconos:** 24px, `#8696A0`

### Reaction Bar (Reproductor)

```
   🔥 23   ❤️ 15   😂 8   👏 5   👍 12
```

- **Chips:** radius full, fondo `#2A3942`, activo `#005C4B`
- **Tamaño emoji:** 20px
- **Counter:** 12px Medium

### QR Share Card

```
┌────────────────────────────────┐
│     📡 EN VIVO                │
│                                │
│        ┌──────────┐           │
│        │  QR CODE │           │
│        └──────────┘           │
│                                │
│     DJ Nombre · Reggaeton      │
│     whatsound.app/dj/code      │
│                                │
│  [WhatsApp] [Telegram] [Copy]  │
└────────────────────────────────┘
```

- **Fondo:** Gradiente `#075E54 → #128C7E`
- **QR:** 200px × 200px, blanco sobre transparente
- **Radius:** 16px

---

## Reglas Generales

1. **Cada componente tiene 4 estados:** default, hover/press, focused, disabled
2. **Press state:** opacity 0.7 (200ms ease)
3. **Transiciones:** 200ms ease para colores, 300ms ease para layout
4. **Skeleton loading:** Rectángulos `#2A3942` con shimmer animation
5. **Empty states:** Icono 48px + texto centered + CTA button
6. **Pull to refresh:** Indicador circular `#25D366`
