# WhatsSound — Stack Tecnológico Definitivo

> Documento generado por mesa redonda: Dan Abramov, Guillermo Rauch, Evan You, Supabase Lead, James Hawkins, Pieter Levels, Leo.

---

## Resumen Ejecutivo

| Capa | Decisión | Alternativa descartada |
|------|----------|----------------------|
| Frontend móvil | **Expo (React Native)** | Flutter, PWA |
| Frontend web | **Next.js 14 (App Router)** | Nuxt, SvelteKit |
| Backend API | **Node.js + Fastify** | Go, Elixir |
| BaaS / DB | **Supabase (PostgreSQL 15)** | Firebase, PlanetScale |
| Realtime | **Supabase Realtime + Socket.io (híbrido)** | Ably, Pusher |
| API música | **Spotify Web API + Apple MusicKit JS** | Deezer, SoundCloud |
| Pagos | **RevenueCat (móvil) + Stripe (web)** | Solo Stripe |
| Auth | **Supabase Auth (OTP SMS via Twilio)** | Firebase Auth, Clerk |
| Push | **Firebase Cloud Messaging (FCM)** | OneSignal |
| Deploy backend | **Fly.io** | Railway, AWS ECS |
| Deploy web | **Vercel** | Netlify, Cloudflare Pages |
| CDN/Storage | **Supabase Storage + Cloudflare R2** | S3 |
| Monitoring | **Sentry + PostHog + Grafana** | Datadog |

---

## Debates y Justificaciones

### 1. Frontend Móvil: Expo (React Native)

**🔥 El debate:**

**Pieter:** "PWA primero. Cero dependencia de App Store, deploy en minutos, iteración brutal."

**Dan:** "Para una app de mensajería musical con audio en background, reproductor nativo, notificaciones push ricas... PWA no llega. Necesitas APIs nativas."

**Evan:** "Flutter tiene mejor rendimiento en animaciones y UI consistente cross-platform."

**Dan:** "Pero el ecosistema React Native es 10x más grande. Spotify, Discord, Instagram — todas React Native. Las librerías de audio, chat, QR ya existen."

**Guillermo:** "Expo SDK 51 resuelve el 95% de los casos nativos sin eyectar. EAS Build para CI/CD. Expo Router para navegación file-based como Next.js."

**Leo:** "WhatsSound necesita: reproductor de audio en background, QR scanner, deep links, push notifications, acceso a contactos. Todo esto existe en Expo."

**✅ Decisión: Expo (React Native) con Expo Router**

**Por qué:**
- Ecosistema maduro con librerías probadas para audio, chat, QR
- Expo Router = navegación file-based, familiar para devs web
- EAS Build = CI/CD nativo sin configurar Xcode/Gradle manualmente
- OTA updates con expo-updates para hotfixes sin pasar por App Store
- Comunidad masiva, hiring fácil
- Shared code con web vía React Native Web (~70% code sharing)

**Riesgo mitigado:** Si necesitamos un módulo nativo custom, Expo permite "prebuild" sin eyectar completamente.

---

### 2. Frontend Web: Next.js 14 (App Router)

**Guillermo:** "Next.js App Router con RSC. Landing, dashboard de DJ, onboarding — todo SSR con streaming. Edge Runtime para latencia mínima global."

**Evan:** "Nuxt 3 es más ligero y con mejor DX para apps medianas."

**Dan:** "Pero si el móvil es React Native, compartir lógica (hooks, estado, types) con Next.js es trivial. Con Nuxt necesitas duplicar."

**Pieter:** "Además, Vercel tiene el mejor DX para deploy. Preview deployments por PR gratis."

**✅ Decisión: Next.js 14 App Router**

**Por qué:**
- Máximo code sharing con React Native (hooks, types, utils)
- RSC para landing pages SEO-friendly
- API Routes para webhooks (Stripe, Spotify)
- Edge Runtime para middleware de auth y geolocation
- Preview deployments para QA

---

### 3. Backend: Node.js + Fastify

**🔥 El debate:**

**Pieter:** "¿Por qué no solo Supabase? Edge Functions + PostgREST + Realtime. Cero backend custom."

**Supabase Lead:** "Para el 80% del CRUD, PostgREST es perfecto. Pero la cola de música con votación, sincronización de reproducción entre usuarios, integración con Spotify SDK... necesitan lógica de negocio compleja."

**Evan:** "¿Go para el backend de sesiones? Goroutines para manejar 100k conexiones concurrentes."

**Dan:** "TypeScript end-to-end. Un solo lenguaje. Monorepo. Types compartidos entre frontend y backend. La productividad del equipo es 2-3x."

**James:** "Fastify sobre Express. 2x más rápido, schema validation nativa con JSON Schema, mejor para observabilidad con hooks de lifecycle."

**✅ Decisión: Node.js + Fastify (TypeScript)**

**Por qué:**
- TypeScript end-to-end = tipos compartidos, menos bugs, mejor DX
- Fastify: ~77k req/s vs Express ~15k req/s (benchmarks)
- Schema validation built-in (reemplaza Joi/Zod en la capa HTTP)
- Plugin system para modularizar (auth, sessions, music, chat)
- Supabase client JS funciona nativamente
- Si un servicio necesita más rendimiento → extraer a Go/Rust después (YAGNI por ahora)

**Arquitectura híbrida:**
```
Supabase PostgREST → CRUD simple (users, profiles, playlists)
Fastify API        → Lógica compleja (sesiones DJ, cola musical, votación, sync)
Supabase Edge Fn   → Webhooks, triggers ligeros
```

---

### 4. Base de Datos: Supabase (PostgreSQL 15)

**Supabase Lead:** "PostgreSQL es la base de datos más completa que existe. JSONB para datos flexibles, full-text search para buscar canciones, Row Level Security para auth a nivel de fila."

**Pieter:** "¿Y si necesitamos datos no relacionales? ¿Chat messages a escala?"

**Supabase Lead:** "PostgreSQL con partitioning por fecha para mensajes de chat. Cuando llegues a billones de mensajes, migras chat a ScyllaDB. Pero eso es problema de año 2+."

**James:** "Importante: pg_stat_statements para query monitoring, pgBouncer para connection pooling. Supabase incluye ambos."

**✅ Decisión: Supabase PostgreSQL 15**

**Por qué:**
- RLS (Row Level Security) = autorización declarativa, menos código
- Realtime integrado (escuchar cambios en tablas)
- PostgREST auto-genera API REST desde el schema
- pg_cron para jobs programados (limpiar sesiones expiradas)
- Supabase Vault para secrets
- Migrations con supabase CLI (versionado en git)
- Connection pooling con pgBouncer (incluido)
- Backups automáticos point-in-time

**Extensiones activas:**
- `pgcrypto` — UUIDs, hashing
- `pg_trgm` — búsqueda fuzzy de canciones/usuarios
- `pg_cron` — tareas programadas
- `pgjwt` — JWT verification en RLS policies

---

### 5. Realtime: Híbrido (Supabase Realtime + Socket.io)

**🔥 El debate:**

**Supabase Lead:** "Supabase Realtime maneja Postgres Changes (CDC), Broadcast y Presence. Para chat y estado de sesión es perfecto."

**Dan:** "Pero la sincronización de reproducción musical necesita latencia <100ms. Supabase Realtime tiene overhead de pasar por la DB."

**Guillermo:** "Socket.io para la capa de sesiones musicales en tiempo real. Rooms = sesiones de DJ. Broadcasting directo, sin pasar por DB."

**Pieter:** "¿No es over-engineering tener dos sistemas realtime?"

**James:** "No. Son dos patrones distintos. Supabase Realtime para data sync (mensajes de chat persisten en DB). Socket.io para ephemeral state (posición de reproducción, quién está escuchando ahora)."

**✅ Decisión: Híbrido**

| Caso de uso | Tecnología | Razón |
|-------------|-----------|-------|
| Chat messages | Supabase Realtime (Postgres Changes) | Mensajes persisten en DB, CDC natural |
| Presencia en sesión | Supabase Realtime (Presence) | Track de usuarios online, built-in |
| Sync reproducción | Socket.io (custom server) | Latencia <50ms, estado efímero |
| Cola de música / votos | Socket.io + DB write-behind | Votos en memoria → flush a DB cada 5s |
| Notificaciones in-app | Supabase Realtime (Broadcast) | Channel-based, simple |

---

### 6. API Música: Spotify Web API + Apple MusicKit

**Leo:** "El 80% de usuarios usará Spotify. Pero no podemos ignorar Apple Music. Y necesitamos un fallback para usuarios sin premium."

**Dan:** "Spotify Web API para search, metadata, playlists. Spotify SDK (iOS/Android) para playback nativo. Apple MusicKit JS para web, MusicKit para nativo."

**✅ Decisión:**
- **Spotify Web API** — búsqueda, metadata, playlists, recomendaciones
- **Spotify iOS/Android SDK** — reproducción nativa (requiere Premium)
- **Apple MusicKit** — alternativa para ecosistema Apple
- **Fallback: previews de 30s** — para usuarios sin suscripción premium

**Abstracción clave:** `MusicProvider` interface que abstraiga Spotify/Apple Music. El resto de la app no sabe qué servicio usa el usuario.

---

### 7. Pagos: RevenueCat + Stripe

**Pieter:** "RevenueCat. Maneja suscripciones iOS/Android, App Store billing, Google Play billing, restauración de compras, analytics de revenue. Todo en uno."

**Guillermo:** "Para web, Stripe. RevenueCat tiene integración con Stripe para unificar el billing."

**✅ Decisión: RevenueCat (móvil) + Stripe (web)**

**Por qué RevenueCat:**
- Abstrae App Store / Google Play billing
- Entitlements system = qué features tiene cada plan
- Webhooks para sync con backend
- Analytics de revenue, churn, LTV
- A/B testing de precios

**Por qué Stripe web:**
- Checkout embeddable, PCI compliant
- Customer portal para gestión de suscripción
- RevenueCat sincroniza con Stripe automáticamente

---

### 8. Auth: Supabase Auth + Twilio OTP

**Supabase Lead:** "Supabase Auth soporta OTP via SMS (Twilio), OAuth (Google, Apple, Spotify), magic links. JWT tokens con RLS."

**Leo:** "WhatsApp-style: login con número de teléfono + OTP. Después vincular Spotify para la experiencia musical."

**✅ Decisión: Supabase Auth**

- **Primary:** Phone OTP via Twilio (WhatsApp-style onboarding)
- **Secondary:** OAuth con Spotify (vincular cuenta para playback)
- **Terciario:** Apple Sign-In (requerido por App Store si ofreces social login)
- **Session:** JWT con refresh tokens, 1h access / 30d refresh

---

### 9. Push Notifications: FCM

**James:** "FCM es el estándar. Gratis, fiable, integración nativa con Android. Para iOS usa APNs pero FCM lo abstrae."

**Pieter:** "OneSignal tiene mejor DX y segmentación."

**James:** "Pero es otra dependencia de terceros con pricing que escala mal. FCM es gratis ilimitado."

**✅ Decisión: Firebase Cloud Messaging**

- Gratis sin límites
- `expo-notifications` tiene integración nativa
- Rich notifications con imágenes (portadas de álbumes)
- Topic-based para notificar a todos los miembros de una sesión

---

### 10. Deploy

**Guillermo:** "Web en Vercel. Es lo que mejor conozco y lo que mejor funciona con Next.js. Edge network global."

**Pieter:** "Backend en Fly.io. Despliega containers Docker cerca de los usuarios. Multi-region fácil. Pricing predecible."

**James:** "Supabase hosted para la DB. No self-host DB nunca si puedes evitarlo."

**✅ Decisión:**

| Componente | Plataforma | Razón |
|------------|-----------|-------|
| Web (Next.js) | Vercel | DX, edge, preview deploys |
| API (Fastify) | Fly.io | Multi-region, Docker, WebSocket-friendly |
| Socket.io server | Fly.io | Sticky sessions, low latency |
| Database | Supabase Cloud | Managed PostgreSQL, backups, monitoring |
| Storage (media) | Supabase Storage + Cloudflare R2 | R2 para assets estáticos (0 egress cost) |
| Redis (cache/pubsub) | Upstash Redis | Serverless, per-request pricing, global |

**Multi-region strategy (Fase 3):**
```
Primary: EU (Madrid) — mayoría de usuarios iniciales
Secondary: US East — expansión
Edge: Vercel Edge Network — static + middleware global
```

---

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTS                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Expo App │  │ Next.js  │  │ Spotify/Apple Music  │  │
│  │ (iOS/And)│  │  (Web)   │  │      SDKs            │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
└───────┼──────────────┼───────────────────┼──────────────┘
        │              │                   │
        ▼              ▼                   ▼
┌───────────────────────────────────────────────────────┐
│                    EDGE LAYER                          │
│  ┌─────────────────┐  ┌───────────────────────────┐   │
│  │  Vercel Edge     │  │  Cloudflare R2 (assets)   │   │
│  │  (middleware)    │  │                           │   │
│  └────────┬────────┘  └───────────────────────────┘   │
└───────────┼───────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Fastify API  │  │ Socket.io    │  │ Supabase    │ │
│  │ (Fly.io)     │  │ Server       │  │ Edge Fns    │ │
│  │              │  │ (Fly.io)     │  │             │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
└─────────┼──────────────────┼────────────────┼─────────┘
          │                  │                │
          ▼                  ▼                ▼
┌───────────────────────────────────────────────────────┐
│                    DATA LAYER                          │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  Supabase    │  │  Upstash    │  │  Supabase    │ │
│  │  PostgreSQL  │  │  Redis      │  │  Storage     │ │
│  │  (Primary)   │  │  (Cache)    │  │  (Media)     │ │
│  └──────────────┘  └─────────────┘  └──────────────┘ │
└───────────────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                      │
│  ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────────┐ │
│  │Spotify │ │Twilio  │ │Stripe/  │ │ FCM / Sentry │ │
│  │  API   │ │ (OTP)  │ │RevenueCat│ │ / PostHog   │ │
│  └────────┘ └────────┘ └─────────┘ └──────────────┘ │
└───────────────────────────────────────────────────────┘
```

---

## Costos Estimados (Fase 1 MVP, <1k usuarios)

| Servicio | Plan | Costo/mes |
|----------|------|-----------|
| Supabase | Pro | $25 |
| Fly.io | 2 machines | ~$15 |
| Vercel | Pro | $20 |
| Upstash Redis | Pay-as-you-go | ~$5 |
| Twilio SMS | Pay-per-use | ~$20 |
| Cloudflare R2 | Free tier | $0 |
| Sentry | Developer | $0 |
| PostHog | Free tier | $0 |
| RevenueCat | Free tier | $0 |
| **TOTAL** | | **~$85/mes** |

A 100k usuarios: ~$500-800/mes (Supabase Team + Fly.io scale + Twilio volume).
