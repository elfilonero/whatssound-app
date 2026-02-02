# WhatsSound — Plan de Desarrollo por Fases

---

## Fase 1: MVP Funcional (8 semanas)

> **Objetivo:** App funcional que un grupo de 20 amigos pueda usar para una sesión musical. Validar el core loop.

**🔥 Debate:**

**Pieter:** "4 semanas. Login, crear sesión, meter canciones, votar. Ship it."

**Dan:** "Si no ponemos bien la arquitectura ahora, reescribimos todo en Fase 2."

**Pieter:** "No reescribes si usas buenos building blocks. Supabase + Expo + Zustand. Las bases están. Solo es UI y lógica de negocio."

**Guillermo:** "Compromiso: 6-8 semanas. Arquitectura limpia pero solo las features que validen el producto."

**✅ Resolución: 8 semanas. Arquitectura de producción, features mínimas.**

### Semana 1-2: Fundación
- [ ] Setup monorepo (Turborepo, pnpm workspaces)
- [ ] Supabase project + schema inicial (users, sessions, queue_tracks, messages, votes)
- [ ] RLS policies básicas
- [ ] Fastify server con health check en Fly.io
- [ ] Expo app con Expo Router (pantallas placeholder)
- [ ] CI: lint + typecheck en PR
- [ ] Supabase Auth con OTP (Twilio)

### Semana 3-4: Core — Sesiones
- [ ] Crear sesión (nombre, género, público/privado)
- [ ] Generar invite code + QR
- [ ] Unirse a sesión por código / QR / deep link
- [ ] Lista de sesiones activas (feed público)
- [ ] Socket.io server en Fly.io
- [ ] Join/leave session rooms
- [ ] Presencia (quién está online)

### Semana 5-6: Core — Música
- [ ] Vincular cuenta de Spotify (OAuth)
- [ ] Buscar canciones (Spotify Web API)
- [ ] Agregar canción a cola
- [ ] Sistema de votación (Redis sorted sets)
- [ ] Cola ordenada por votos (UI)
- [ ] Reproducción sincronizada (MVP: DJ reproduce, otros ven estado)
- [ ] Now Playing con artwork, artista, progreso

### Semana 7-8: Chat + Polish
- [ ] Chat en sesión (mensajes en DB + Supabase Realtime)
- [ ] Notificaciones push básicas (FCM) — "Tu canción está sonando"
- [ ] Perfil de usuario (nombre, avatar, Spotify vinculado)
- [ ] Onboarding flow completo (phone → OTP → profile → Spotify)
- [ ] Error handling global
- [ ] Dark mode (default)
- [ ] TestFlight / Internal testing track

### Fase 1: QUÉ NO incluye
- ❌ Apple Music (solo Spotify)
- ❌ Pagos / suscripciones
- ❌ Web app
- ❌ Analytics avanzados
- ❌ Moderación de contenido
- ❌ Modo offline
- ❌ Historial de sesiones pasadas

### Entregables
1. App en TestFlight (iOS) + Internal Testing (Android)
2. API en Fly.io
3. Supabase en producción
4. 20 beta testers usando la app

---

## Fase 2: Beta Pública (semanas 9-16)

> **Objetivo:** App lista para ~1,000 usuarios. Feature-complete para el core loop. App Store submission.

### Semana 9-10: Producción Hardening
- [ ] Sentry integración (mobile + API)
- [ ] PostHog analytics (eventos clave: session_created, track_added, vote_cast, etc.)
- [ ] Rate limiting en API
- [ ] Input validation exhaustiva (zod schemas en todas las rutas)
- [ ] E2E tests con Maestro (onboarding, crear sesión, votar)
- [ ] Logging estructurado (pino)
- [ ] Graceful shutdown + health checks

### Semana 11-12: Features Fase 2
- [ ] Historial de sesiones (mis sesiones pasadas)
- [ ] Perfil público con sesiones y stats
- [ ] Reacciones en chat (emoji reactions)
- [ ] Compartir canción en chat (rich embed)
- [ ] Sistema de "follow" a DJs
- [ ] Notificaciones: "DJ que sigues empezó una sesión"
- [ ] Sesión privada (solo invite)
- [ ] Reporte/bloqueo de usuarios

### Semana 13-14: Polish & Performance
- [ ] Skeleton loaders en toda la app
- [ ] Optimistic updates en votación
- [ ] Paginación infinita en feed y chat
- [ ] Image caching con expo-image
- [ ] Offline banner + retry logic
- [ ] Haptic feedback en votos y acciones
- [ ] Animaciones con reanimated (transiciones, votos)
- [ ] Performance profiling (Flipper / React DevTools)

### Semana 15-16: App Store Prep
- [ ] App Store screenshots y metadata
- [ ] Privacy policy + Terms of Service
- [ ] Apple Sign-In (requerido)
- [ ] App Review compliance check
- [ ] Crash-free rate > 99.5%
- [ ] Submit a App Store + Google Play
- [ ] Landing page web (Next.js en Vercel)

### Entregables
1. App en App Store + Google Play (review pendiente)
2. Landing page en whatssound.app
3. 1,000 usuarios beta
4. Crash-free rate > 99.5%
5. <2s time-to-interactive

---

## Fase 3: Lanzamiento Público (semanas 17-24)

> **Objetivo:** Monetización, escala, features premium.

### Semana 17-18: Monetización
- [ ] RevenueCat integración
- [ ] Plan gratuito: unirse a sesiones, votar, chat
- [ ] Plan Pro ($4.99/mes): crear sesiones ilimitadas, cola prioritaria, analytics de DJ
- [ ] Plan DJ ($9.99/mes): sesiones premium (más miembros), monetización, personalización
- [ ] Stripe web checkout
- [ ] Paywall UI con trial de 7 días

### Semana 19-20: Escala
- [ ] Redis cluster (Upstash multi-region)
- [ ] Fly.io auto-scaling (2-8 machines)
- [ ] Connection pooling optimization (pgBouncer)
- [ ] CDN para assets de sesión (Cloudflare R2)
- [ ] Load testing (k6) — target: 10k concurrent users
- [ ] Database indexing audit
- [ ] Query performance optimization

### Semana 21-22: Features Premium
- [ ] Apple Music support (MusicKit)
- [ ] DJ analytics dashboard (web)
- [ ] Session themes / personalización visual
- [ ] "Tip the DJ" (in-app currency o Stripe Connect)
- [ ] Sesiones programadas (empieza a las 9pm)
- [ ] Playlists colaborativas (export a Spotify)
- [ ] Feature flags (PostHog) para rollout gradual

### Semana 23-24: Growth
- [ ] Referral system (invita amigos → premium gratis)
- [ ] Social sharing (Instagram stories, Twitter)
- [ ] OG images dinámicas (sesión con artwork)
- [ ] SEO en landing page
- [ ] ASO (App Store Optimization)
- [ ] Onboarding improvements (basado en analytics)

### Entregables
1. Revenue > $0 (primera suscripción)
2. 10,000 usuarios registrados
3. 500 sesiones creadas
4. <500ms p95 API latency
5. 99.9% uptime

---

## Fase 4: Crecimiento (mes 7+)

> No planificar en detalle. Decidir basado en datos de Fase 3.

**Posibles direcciones:**
- Sesiones con video (DJ streaming)
- Integración con eventos/festivales
- API pública para embeds
- White-label para venues/bares
- Marketplace de DJs
- IA: recomendaciones de canciones basadas en la sesión

---

## Métricas de Éxito por Fase

| Métrica | Fase 1 | Fase 2 | Fase 3 |
|---------|--------|--------|--------|
| Usuarios | 20 | 1,000 | 10,000 |
| DAU | 10 | 200 | 2,000 |
| Sesiones/día | 2 | 50 | 500 |
| Retention D7 | — | 30% | 40% |
| Crash-free | 95% | 99.5% | 99.9% |
| API p95 | <2s | <1s | <500ms |
| Revenue | $0 | $0 | >$500 MRR |

---

## Team Size Recomendado

| Fase | Personas | Roles |
|------|----------|-------|
| Fase 1 | 1-2 | Full-stack + diseño |
| Fase 2 | 2-3 | +1 mobile dev |
| Fase 3 | 3-5 | +1 backend + 1 growth |

**Pieter:** "Una persona puede hacer Fase 1 si sabe lo que hace. El stack está diseñado para eso."

**Dan:** "De acuerdo. Supabase elimina el 60% del backend work. Expo elimina el 80% del native work. Un buen dev full-stack puede."
