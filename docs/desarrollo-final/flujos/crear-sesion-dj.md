# 🎛️ Flujo: Crear Sesión (DJ)

---

## Resumen

Un DJ crea una sesión en vivo donde la gente puede unirse, pedir canciones, votar y chatear. El proceso tarda ~30 segundos.

---

## Flujo

```
[Home] → [FAB +] → [Crear Sesión] → [Configurar] → [Sesión Activa] → [Compartir QR]
```

---

## Paso a Paso

### 1. Iniciar Creación
- Desde Home → FAB "+" (bottom-right)
- Bottom sheet: "Crear sesión" / "Escanear QR"
- Tap "Crear sesión" → pantalla de configuración

### 2. Configurar Sesión

| Campo | Tipo | Obligatorio | Default |
|-------|------|-------------|---------|
| **Nombre de sesión** | Texto, max 40 chars | ✅ | "Sesión de [NombreDJ]" |
| **Género musical** | Selector múltiple (chips) | ✅ | — |
| **Foto de portada** | Imagen (cámara/galería) | ❌ | Gradiente con icono de género |
| **Descripción** | Texto, max 200 chars | ❌ | — |
| **Sesión privada** | Toggle | ❌ | Off (pública) |
| **Permitir propinas** | Toggle | ❌ | On |
| **Auto-aprobar canciones** | Toggle | ❌ | On |
| **Máx. canciones por persona** | Stepper (1-10) | ❌ | 3 |
| **Chat habilitado** | Toggle | ❌ | On |

**Géneros disponibles:** Reggaeton, Pop, Rock, Electrónica, Hip-Hop, R&B, Latin, Indie, Clásica, Jazz, Salsa, Bachata, Otro

### 3. Conectar Fuente de Audio
- Si DJ tiene Spotify conectado: "Reproduciendo desde Spotify" ✓
- Si no: Prompt para conectar servicio de música
- **Modo offline:** Puede crear sesión sin streaming (cola de sugerencias, sin reproducción)

### 4. Sesión Creada — ¡En Vivo!
- Transición al Panel DJ (pantalla 4.1)
- **Toast:** "🟢 ¡Tu sesión está en vivo!"
- **Auto-acción:** Modal de compartir QR aparece automáticamente
- La sesión aparece en el feed "En Vivo" de otros usuarios cercanos

### 5. Compartir Sesión
- Tarjeta QR visual (pantalla 5.1)
- Botones: WhatsApp / Telegram / Instagram Stories / Copiar link
- Link formato: `whatsound.app/s/[código]`
- El DJ puede re-abrir compartir desde icono en header

---

## Decisiones

```
¿Sesión pública o privada?
├── Pública → Aparece en feed "En Vivo", cualquiera puede unirse
└── Privada → Solo via QR o link directo

¿Auto-aprobar canciones?
├── Sí → Las canciones pedidas entran directo a la cola
└── No → DJ debe aprobar cada canción manualmente (pantalla DJ Cola)

¿DJ tiene servicio de música?
├── Sí → Reproducción activa desde Spotify/Apple Music
└── No → Cola de sugerencias (texto), DJ reproduce manualmente
```

---

## Acciones Post-Creación

Una vez la sesión está activa, el DJ puede:
- Ver stats en tiempo real (oyentes, canciones pedidas, reacciones)
- Gestionar la cola (reordenar, aprobar, rechazar)
- Moderar usuarios (silenciar, expulsar, dar VIP)
- Enviar anuncios al chat
- Cerrar la sesión

---

## Pantallas relacionadas

- `pantallas/2.5` — Crear Nueva Sesión
- `pantallas/4.1` — Panel DJ
- `pantallas/4.4` — DJ Config
- `pantallas/5.1` — Compartir QR
