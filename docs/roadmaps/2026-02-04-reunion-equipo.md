# Roadmap - Reunión Equipo Virtual WhatsSound
**Fecha:** 4 febrero 2026, 21:42  
**Asistentes:** 7 expertos (UX, Gamificación, Seguridad, Realtime, Monetización, Audio, Growth)  
**Estado:** Revisión de producción v0.4.0-mvp-demo

---

## Estado Actual Verificado en Producción

✅ **Funcionando:**
- Feed de sesiones en vivo (4 sesiones, 16 oyentes)
- Reproductor con controles, barra de progreso, carátula
- Chat en tiempo real con Supabase
- Sistema de propinas visible (€5 ejemplo)
- Cola de canciones con votos (🔥 24, 🔥 19, 🔥 15)
- Reacciones emoji (🔥 ❤️ 👏 😂 🎵)
- Tabs: Reproductor, Chat, Cola, Gente
- Presence: "X escuchando"
- Audio: FUNCIONA en móvil (probado por Ángel)
- Deep links configurados
- Dashboard admin operativo

---

## Gaps Detectados por Expertos

### 🎨 UX MÚSICA SOCIAL
**Gap:** Falta feedback háptico en reacciones
**Tarea:** Añadir vibración al enviar reacción
**Tiempo estimado:** 30 min
**Archivos:** `src/components/session/FloatingReaction.tsx`

### 🎮 GAMIFICACIÓN
**Gap 1:** No hay rachas de escucha
**Tarea:** Implementar contador de días consecutivos escuchando
**Tiempo estimado:** 2 horas
**Archivos:** 
- Crear `src/hooks/useListeningStreak.ts`
- Crear tabla `ws_listening_streaks`
- Mostrar en perfil

**Gap 2:** No hay badges de usuario frecuente
**Tarea:** Sistema de insignias por hitos
**Tiempo estimado:** 2 horas
**Archivos:**
- Crear `src/components/profile/BadgeDisplay.tsx`
- Crear tabla `ws_badges`, `ws_user_badges`

### 🔒 SEGURIDAD
**Gap:** Verificar RLS en queries del cliente
**Tarea:** Auditar todas las queries de Supabase en el cliente
**Tiempo estimado:** 1 hora
**Archivos:** Todos los archivos en `src/lib/` que usan supabase

### ⚡ REALTIME Y ARQUITECTURA
**Gap:** Optimizar reconexión de canales
**Tarea:** Añadir retry con backoff exponencial en desconexiones
**Tiempo estimado:** 1 hora
**Archivos:** `src/hooks/usePresence.ts`, `src/hooks/useRealtimeChat.ts`

### 💰 MONETIZACIÓN
**Estado:** ✅ Completo
- Stripe integrado
- Propinas funcionando
- Golden Boost implementado
**Mejora opcional:** Analytics de conversión de propinas

### 🎵 AUDIO STREAMING
**Estado:** ✅ Funcionando en móvil
**Mejora:** Sincronización entre oyentes (todos escuchan lo mismo)
**Tiempo estimado:** 3 horas
**Archivos:** `src/hooks/useBackgroundAudio.ts`

### 🚀 GROWTH VIRAL
**Gap:** Falta invitar amigos con recompensa
**Tarea:** Sistema de referidos
**Tiempo estimado:** 3 horas
**Archivos:**
- Crear `src/components/invite/ReferralCard.tsx`
- Crear tabla `ws_referrals`
- Endpoint de tracking

---

## Orden de Prioridad (Consenso del Equipo)

| # | Tarea | Tiempo | Prioridad |
|---|-------|--------|-----------|
| 1 | Auditoría RLS Seguridad | 1h | 🔴 CRÍTICO |
| 2 | Feedback háptico reacciones | 30min | 🟡 MEDIO |
| 3 | Retry reconexión realtime | 1h | 🟡 MEDIO |
| 4 | Rachas de escucha | 2h | 🟢 MEJORA |
| 5 | Badges usuario | 2h | 🟢 MEJORA |
| 6 | Sincronización audio | 3h | 🟢 MEJORA |
| 7 | Sistema referidos | 3h | 🟢 MEJORA |

**Total estimado:** 12.5 horas

---

## Próximos Pasos

1. ✅ Documento creado
2. ⏳ Subir a repositorio
3. ⏳ Crear recordatorios en tiempo real

---

*Generado: 4 feb 2026, 21:42 CET*
*Equipo: Tanke + 7 Expertos Virtuales*
