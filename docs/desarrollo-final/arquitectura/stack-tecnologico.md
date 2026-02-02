# 🏗️ WhatsSound — Stack Tecnológico

---

## Frontend (Mobile)

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **Framework** | React Native + Expo | Cross-platform, hot reload, ecosystem maduro, deploy OTA |
| **Navegación** | React Navigation v7 | Estándar en RN, tabs + stacks + modals |
| **Estado global** | Zustand | Ligero, sin boilerplate, perfecto para real-time |
| **Estado servidor** | TanStack Query (React Query) | Cache, refetch, optimistic updates |
| **Estilos** | NativeWind (Tailwind CSS) | Utilidades rápidas, consistencia con design system |
| **Animaciones** | Reanimated 3 + Moti | 60fps nativo, gestos fluidos |
| **Audio** | expo-av + streaming SDK | Reproducción local + streaming |
| **QR** | expo-camera + expo-barcode-scanner | Escaneo nativo |
| **Pagos** | Stripe React Native SDK | Apple Pay, Google Pay, tarjetas |
| **Push** | expo-notifications + Firebase Cloud Messaging | Cross-platform push |
| **Deep links** | expo-linking + branch.io | Universal links, deferred deep links |

### Alternativa considerada
- **Flutter** — Buena opción pero el ecosistema de paquetes musicales es más maduro en RN.
- **Nativo (Swift/Kotlin)** — Descartado por cost/time. Se puede migrar módulos críticos después.

---

## Backend

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **Runtime** | Node.js 20 LTS | Async I/O ideal para real-time, JS fullstack |
| **Framework** | Fastify | 2x más rápido que Express, schema validation, plugins |
| **ORM** | Prisma | Type-safe, migrations, introspection |
| **Base de datos** | PostgreSQL 16 | Relacional robusto, JSON support, full-text search |
| **Cache** | Redis 7 | Sesiones, colas, pub/sub, rate limiting |
| **Auth** | JWT + OTP via Twilio/Vonage | Teléfono + verificación SMS |
| **File storage** | AWS S3 / Cloudflare R2 | Avatares, portadas, audio clips |
| **Validación** | Zod | Schema validation compartido frontend/backend |

---

## Tiempo Real

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **WebSockets** | Socket.IO | Rooms (sesiones), fallback polling, reconexión auto |
| **Pub/Sub** | Redis Pub/Sub | Escalar WebSockets a múltiples instancias |
| **Eventos** | Custom event bus | Chat, votos, cola, reacciones, propinas |

### Eventos principales

| Evento | Dirección | Datos |
|--------|-----------|-------|
| `session:join` | Client → Server | sessionId, userId |
| `session:leave` | Client → Server | sessionId |
| `chat:message` | Bidireccional | message object |
| `queue:vote` | Client → Server | songId, vote (+1/-1) |
| `queue:update` | Server → Client | cola ordenada completa |
| `now_playing` | Server → Client | canción actual + progress |
| `reaction` | Bidireccional | type, userId |
| `tip:sent` | Server → Client | tipAmount, fromUser, message |
| `user:joined` | Server → Client | user info |
| `dj:announce` | Server → Client | announcement text |

---

## APIs de Música

| Servicio | Uso | Límites |
|----------|-----|---------|
| **Spotify Web API** | Búsqueda, metadata, playback (Premium) | 100 req/min por usuario |
| **Apple Music API** | Búsqueda, metadata, playback (suscriptor) | 200 req/min |
| **YouTube Music** (vía YouTube Data API) | Búsqueda, metadata | 10,000 unidades/día |

> **Nota:** La reproducción real depende de la suscripción del DJ. WhatsSound no transmite audio directamente — controla la reproducción en el dispositivo del DJ via SDK.

---

## Pagos

| Capa | Tecnología |
|------|-----------|
| **Procesador** | Stripe Connect (marketplace) |
| **Apple Pay** | Stripe Apple Pay integration |
| **Google Pay** | Stripe Google Pay integration |
| **Bizum** | Via pasarela local (Redsys) — España |
| **Payouts** | Stripe Connect payouts → cuenta DJ |

---

## Infraestructura

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **Hosting** | Railway / Render | Deploy fácil, scale automático, PostgreSQL managed |
| **CDN** | Cloudflare | Assets estáticos, R2 storage, DNS |
| **CI/CD** | GitHub Actions | Build, test, deploy automático |
| **Monitoring** | Sentry (errors) + Axiom (logs) | Error tracking + log aggregation |
| **Analytics** | Mixpanel / PostHog | Eventos de producto, funnels, retention |
| **APM** | Sentry Performance | Traces, latencia, bottlenecks |

### Alternativa a escalar
- **Producción alta:** Migrar a AWS (ECS/EKS) + Aurora PostgreSQL + ElastiCache
- **WebSockets a escala:** Socket.IO con Redis adapter + múltiples instancias

---

## Arquitectura Simplificada

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  React      │────▶│  Fastify API     │────▶│  PostgreSQL   │
│  Native     │     │  + Socket.IO     │     │  (datos)      │
│  (Expo)     │◀────│                  │────▶│  Redis        │
└─────────────┘     └──────────────────┘     │  (cache/RT)   │
       │                     │                └──────────────┘
       │                     │
       ▼                     ▼
┌─────────────┐     ┌──────────────────┐
│  Spotify/   │     │  Stripe          │
│  Apple/YT   │     │  (pagos)         │
│  Music APIs │     │                  │
└─────────────┘     └──────────────────┘
```
