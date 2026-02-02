# 📲 Flujo: Unirse a Sesión (via QR / Link)

---

## Resumen

Un usuario se une a una sesión de DJ escaneando un QR, tocando un link compartido, o seleccionando una sesión del feed.

---

## 3 Caminos de Entrada

### Camino A: Escanear QR
```
[Home] → [FAB +] → [Escanear QR] → [Cámara] → [Detectar QR] → [Preview Sesión] → [Unirse]
```

### Camino B: Link Compartido
```
[WhatsApp/Telegram/etc] → [Tap link] → [Deep Link] → [App abre] → [Preview Sesión] → [Unirse]
```

### Camino C: Feed En Vivo
```
[Home — En Vivo] → [Tap Session Card] → [Preview Sesión] → [Unirse]
```

---

## Paso a Paso

### 1. Descubrimiento

**Via QR:**
- Desde FAB → "Escanear QR"
- Cámara con overlay de marco QR
- Detección automática → vibración háptica al detectar
- Si QR no es de WhatsSound: "Este QR no es de WhatsSound"

**Via Link:**
- `whatsound.app/s/ABC123`
- Si tiene app: deep link abre directo
- Si no tiene app: web landing → "Descarga WhatsSound" + botones store
- Si no está logueado: onboarding → después redirige a la sesión

**Via Feed:**
- Lista de sesiones en vivo con cards (Session Card)
- Info visible: DJ, género, nº oyentes, canción actual
- Tap → preview

### 2. Preview de Sesión

Modal o pantalla intermedia:

```
┌────────────────────────────────┐
│  🖼️ Portada de sesión         │
│                                │
│  DJ NombreDJ  🟢 En vivo      │
│  Reggaeton · 23 personas       │
│                                │
│  🎵 Ahora suena:              │
│  "Canción" — Artista           │
│                                │
│  ┌──────────────────────────┐  │
│  │       UNIRSE             │  │
│  └──────────────────────────┘  │
│                                │
│        Vista previa ▶️         │
└────────────────────────────────┘
```

- **Vista previa (opcional):** 15s de audio de la canción actual
- Si sesión privada + requiere aprobación: "Solicitar acceso"

### 3. Unirse

- Tap "Unirse" → loading 1-2s (conexión WebSocket)
- Transición a la sesión (vista Reproductor por defecto)
- **Toast:** "🎵 Te uniste a la sesión de DJ Nombre"
- El usuario aparece en la lista de Gente
- El chat muestra: "[Usuario] se unió a la sesión"

---

## Decisiones

```
¿Tiene la app instalada?
├── Sí → Deep link abre la sesión
└── No → Web landing con botones de descarga

¿Está logueado?
├── Sí → Directo a preview de sesión
└── No → Onboarding completo → después redirige

¿Sesión pública?
├── Sí → Unirse directo
└── No → "Solicitar acceso" → DJ aprueba/rechaza

¿Sesión llena? (si hay límite)
├── No → Unirse normal
└── Sí → "Sesión llena. Te avisamos cuando haya sitio." [Notificarme]

¿Sesión cerrada?
├── Activa → Unirse
└── Cerrada → "Esta sesión ha terminado" + stats resumen + "Ver sesiones activas"
```

---

## Edge Cases

| Caso | Comportamiento |
|------|----------------|
| **QR expirado** | "Esta sesión ya no existe" + volver al feed |
| **Sin conexión** | "Sin conexión. Comprueba tu internet." + retry |
| **Usuario baneado** | "No puedes unirte a esta sesión" (sin explicar por qué) |
| **Ya está en la sesión** | Directo a la sesión (no duplicar) |
| **DJ se fue** | "El DJ ha abandonado la sesión" + opción de quedarse |

---

## Pantallas relacionadas

- `pantallas/2.1` — Landing En Vivo
- `pantallas/2.4` — Escanear QR
- `pantallas/3.1` — Sesión Reproductor
- `pantallas/5.2` — Deep Link Landing
