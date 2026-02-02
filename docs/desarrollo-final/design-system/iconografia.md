# 🎯 WhatsSound — Guía de Iconografía

> **Principio:** Iconos de línea (outlined) como base, filled para estados activos. Estilo consistente con Material Symbols / SF Symbols.

---

## Estilo

| Propiedad | Valor |
|-----------|-------|
| **Estilo base** | Outlined (línea), rounded caps |
| **Estilo activo** | Filled (relleno) para tabs/nav seleccionados |
| **Grosor de trazo** | 1.5px (tamaños 24px), 2px (tamaños 20px) |
| **Esquinas** | Rounded (nunca sharp) |
| **Librería recomendada** | Phosphor Icons / Material Symbols Rounded |

---

## Tamaños

| Token | Tamaño | Uso |
|-------|--------|-----|
| `icon-xs` | 16px | Inline con texto, indicadores |
| `icon-sm` | 20px | Botones secundarios, chips |
| `icon-md` | 24px | Estándar — listas, toolbar, tabs |
| `icon-lg` | 28px | Acciones principales en pantalla |
| `icon-xl` | 32px | Headers, estados vacíos |
| `icon-2xl` | 48px | Ilustraciones en empty states |

---

## Colores de Iconos

| Contexto | Color |
|----------|-------|
| **Activo / seleccionado** | `#25D366` (verde) |
| **Inactivo / default** | `#8696A0` (gris) |
| **Sobre fondo verde** | `#FFFFFF` |
| **Destructivo** | `#F44336` (rojo) |
| **Informativo** | `#29B6F6` (azul) |
| **Warning / propina** | `#FFA726` (naranja) |
| **Deshabilitado** | `#4A5D6A` |

---

## Catálogo de Iconos Necesarios

### Navegación
- 🏠 Home / Landing
- 🔍 Buscar
- ⚙️ Ajustes / Gear
- ← Flecha atrás
- ✕ Cerrar
- ⋮ Menú más opciones (3 dots vertical)

### Tabs de Sesión
- 🎵 Nota musical (sonando/reproductor)
- 💬 Chat / burbuja
- 📋 Cola / lista
- 👥 Gente / personas

### Música
- ▶️ Play
- ⏸ Pause
- ⏭ Skip / siguiente
- 🔀 Shuffle
- 🔁 Repeat
- 🎵 Nota musical
- 🎧 Auriculares
- 📻 Radio / en vivo

### Interacción
- 👍 Like / voto positivo
- 🔥 Fuego (reacción)
- ❤️ Corazón
- 😂 Risa
- 👏 Aplausos
- ➕ Añadir / pedir canción
- 🗑 Eliminar / rechazar

### Chat
- 😀 Emoji picker
- 🎵 Adjuntar música
- 📷 Cámara
- 🎤 Micrófono (audio)
- ↩️ Responder
- 📋 Copiar
- ➡️ Reenviar

### DJ Panel
- 🎛 Panel de control
- 📊 Estadísticas
- 🔇 Silenciar usuario
- 🚫 Expulsar
- ⭐ Dar VIP
- 🛡 Moderador
- 📢 Anunciar
- 🎲 Sorpresa (canción random)

### Ajustes
- 👤 Perfil / cuenta
- 🔒 Privacidad
- 🔔 Notificaciones
- 💾 Almacenamiento
- 🌐 Idioma
- ❓ Ayuda
- 📤 Invitar amigos
- 🎵 Servicios de música

### Estados
- 🟢 Online dot
- 📡 En vivo / streaming
- ✓✓ Doble check (leído)
- 🔗 Link / compartir

---

## Reglas

1. **Un icono = un significado** — no reusar el mismo icono para conceptos distintos
2. **Siempre 24px** salvo excepciones documentadas
3. **Padding de touch: (44-iconSize)/2** alrededor del icono
4. **Tabs:** outlined inactivo, filled activo, con label debajo
5. **Toolbar:** siempre 24px, color `#8696A0` o `#E9EDEF`
6. **No usar iconos con texto redundante** — si el label dice "Buscar", el icono de lupa es suficiente
