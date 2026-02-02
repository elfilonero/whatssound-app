# 🎵 Flujo: Pedir y Votar Canción

---

## Resumen

Los usuarios buscan canciones, las piden para la cola, y la audiencia vota. La canción más votada sube al #1. El DJ puede aprobar, rechazar o reordenar.

---

## Flujo: Pedir Canción

```
[Sesión] → [Tab Cola] → [FAB "Pedir canción"] → [Buscar] → [Seleccionar] → [Confirmar] → [En cola]
```

### 1. Abrir Búsqueda
- Desde tab "Cola": FAB "🎵 Pedir canción" o campo de búsqueda
- Desde chat: Botón 🎵 en input bar → abre búsqueda
- **Requiere:** Servicio de música conectado. Si no: prompt de conexión.

### 2. Buscar Canción
- **Input:** Campo de búsqueda con auto-suggest
- **Fuente:** API del servicio conectado (Spotify, Apple Music, YouTube Music)
- **Resultados:** Lista con portada (40px) + título + artista + duración
- **Preview:** Tap largo → 15s de preview de audio
- **Historial:** Búsquedas recientes debajo del input
- **Sugerencias:** "Popular en esta sesión" si el género está definido

### 3. Seleccionar y Confirmar

```
┌────────────────────────────────┐
│  🖼️  Nombre de la Canción     │
│  48px Artista — 3:42           │
│                                │
│  💬 Mensaje (opcional)         │
│  "¡Esta canción es un temazo!" │
│                                │
│  🔥 Añadir propina (opcional)  │
│  [€1] [€2] [€5] [Otro]        │
│                                │
│  ┌──────────────────────────┐  │
│  │     PEDIR CANCIÓN        │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

- **Mensaje opcional:** Aparece en el chat como burbuja de canción
- **Propina opcional:** Aumenta la prioridad visual (borde dorado)
- **CTA:** "Pedir canción" → loading → confirmación

### 4. En Cola
- La canción aparece en la cola con 1 voto (del que pidió)
- Posición según votos (o al final si auto-aprobación off)
- **Chat:** Burbuja especial: "[Usuario] pidió 🎵 Canción — Artista" + botón Votar
- **Notificación al DJ:** Si auto-aprobar está off → badge en tab Cola

---

## Flujo: Votar Canción

```
[Ver cola] → [Tap icono voto 🔥] → [Voto registrado] → [Posición actualiza]
```

### Mecánica de votación

- **1 voto por canción por usuario** (toggle on/off)
- Tap 🔥 → icono se ilumina verde `#25D366` + contador +1
- Tap de nuevo → quitar voto (toggle)
- **Animación:** Icono hace pulse + número hace bump
- **Reordenamiento:** La cola se reordena en tiempo real por votos
- **Empate:** Desempata por timestamp (la más antigua primero)

### Dónde votar

1. **Tab Cola:** Cada canción tiene botón de voto
2. **Chat:** Burbuja de canción compartida tiene botón "Votar"
3. **Notificación push:** "🎵 [User] pidió Canción — [Votar]" (acción directa)

---

## Flujo DJ: Gestionar Cola

```
[DJ Cola] → [Aprobar/Rechazar] → [Reordenar drag] → [Reproducir siguiente]
```

- **Aprobar:** ✅ → canción entra a la cola pública
- **Rechazar:** ❌ → canción se marca rejected + notif al que pidió
- **Reordenar:** Drag & drop para mover canciones
- **Reproducir:** Tap en canción → "Reproducir ahora" (salta cola)
- **AutoDJ:** Toggle que reproduce automáticamente la más votada al terminar la actual
- **Sorpresa:** Botón que mezcla una canción random del género

---

## Restricciones

| Regla | Valor por defecto | Configurable |
|-------|-------------------|--------------|
| Max canciones por usuario | 3 por sesión | Sí (1-10) |
| Duplicados | No permitidos en la misma sesión | No |
| Contenido explícito | Permitido | Sí (toggle DJ) |
| Tiempo mínimo entre pedidos | 0 (sin límite) | Futuro |

---

## Edge Cases

| Caso | Comportamiento |
|------|----------------|
| **Límite alcanzado** | "Ya pediste 3 canciones. Espera a que suene una." |
| **Canción ya en cola** | "Esta canción ya está en la cola. ¡Vótala!" + link a la canción |
| **Canción no disponible** | "Esta canción no está disponible en tu región" |
| **Servicio desconectado** | "Reconecta Spotify para pedir canciones" |
| **Sesión sin DJ** | Cola congelada, votos siguen funcionando |
| **DJ rechaza** | Notif: "El DJ rechazó tu canción. Prueba con otra." |

---

## Pantallas relacionadas

- `pantallas/3.3` — Cola (User)
- `pantallas/3.5` — Pedir Canción (modal)
- `pantallas/3.6` — Detalle de Canción
- `pantallas/4.2` — DJ Cola
