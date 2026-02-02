# 💬 Flujo: Chat en Sesión

---

## Resumen

Cada sesión tiene un chat en tiempo real donde los usuarios comentan, reaccionan, comparten canciones y se comunican con el DJ y la audiencia.

---

## Flujo Principal

```
[Sesión] → [Tab Chat] → [Escribir mensaje] → [Enviar] → [Burbuja aparece]
```

---

## Tipos de Mensajes

### 1. Texto Normal
- Input en barra inferior
- Max 500 caracteres
- Emojis inline (teclado de emojis estándar)
- Enviar con botón o Enter

### 2. Mensaje con Mención
- Escribir "@" → dropdown de usuarios de la sesión
- Seleccionar → "@NombreUsuario" en verde `#25D366`
- El mencionado recibe notificación
- Tap en mención → perfil del usuario (modal)

### 3. Audio / Nota de Voz
- Mantener pulsado 🎤 → grabar
- Soltar → enviar
- Deslizar izquierda → cancelar
- Waveform visual en burbuja + duración + play/pause
- Max duración: 60 segundos

### 4. Canción Compartida (Sistema)
- Cuando alguien pide canción, aparece burbuja especial:
```
┌─────────────────────────────────┐
│ 🎵 @User pidió una canción      │
│ ┌──────┬──────────────────────┐ │
│ │ 🖼️  │ Nombre Canción       │ │
│ │ 40px │ Artista — 3:42       │ │
│ └──────┴──────────────────────┘ │
│           [🔥 Votar · 5]       │
└─────────────────────────────────┘
```
- Botón Votar funcional directamente desde el chat

### 5. Mensaje del Sistema
- Join/leave: "[User] se unió a la sesión"
- Canción: "🎵 Ahora suena: Canción — Artista"
- Propina: "🔥 [User] envió propina al DJ"
- Centrado, fondo `#182229`, texto `#8696A0`

### 6. Anuncio del DJ
- Burbuja destacada con borde verde `#25D366`
- Badge "📢 DJ" prominente
- Fondo ligeramente diferente: `#1A3A2A`
- No se puede responder directamente (solo reaccionar)

### 7. Reacciones Rápidas
- Mantener pulsado mensaje → barra de reacciones: 🔥 ❤️ 😂 👏 👍 😮
- Reacción aparece debajo de la burbuja
- Múltiples reacciones se apilan con contador
- Tap en reacción existente → sumar la tuya

---

## Barra de Input

```
┌─ 😀 │ Escribe un mensaje...   │ 🎵 📷 🎤 ─┐
```

| Icono | Acción |
|-------|--------|
| 😀 | Abrir teclado de emojis / stickers |
| 🎵 | Buscar y compartir canción (abre búsqueda) |
| 📷 | Enviar foto (cámara / galería) |
| 🎤 | Nota de voz (mantener pulsado) |

- Al escribir texto: 🎤 cambia a ➤ (enviar)
- Input se expande multilínea (max 4 líneas visibles)

---

## Moderación

### DJ puede:
- **Fijar mensaje** — Aparece fijo en top del chat
- **Eliminar mensaje** — Desaparece para todos
- **Silenciar usuario** — No puede escribir (5min / 1h / sesión)
- **Modo lento** — Límite de 1 mensaje cada X segundos

### Automática:
- Filtro de spam: mensajes repetidos > 3 veces → auto-silencio 5min
- Filtro de links: Links externos bloqueados por defecto (DJ puede habilitar)
- Filtro de palabras: Lista negra configurable

---

## Comportamiento en Tiempo Real

- Mensajes llegan via WebSocket, sin refresh
- Scroll automático al fondo si el usuario está en el bottom
- Si está leyendo arriba: badge "↓ 3 mensajes nuevos" para bajar
- Indicador "escribiendo..." cuando otros escriben (opcional, configurable)
- Máximo visible: 500 mensajes (scroll infinito hacia arriba carga más)

---

## Edge Cases

| Caso | Comportamiento |
|------|----------------|
| **Usuario silenciado** | Input deshabilitado: "Silenciado por el DJ" + tiempo restante |
| **Chat deshabilitado por DJ** | Tab visible pero gris: "El DJ desactivó el chat" |
| **Desconexión** | Banner amarillo: "Reconectando..." + mensajes pendientes se envían al reconectar |
| **Mensaje muy largo** | Truncado con "... Ver más" |
| **Muchos mensajes** | Auto-scroll + agrupación temporal ("Hace 5 min") |

---

## Pantallas relacionadas

- `pantallas/3.2` — Sesión Chat
- `pantallas/4.5` — DJ Anunciar
- `pantallas/3.7` — Perfil de Usuario (via tap en nombre)
