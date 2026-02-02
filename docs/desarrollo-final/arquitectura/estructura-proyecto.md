# WhatsSound — Estructura del Proyecto

> Monorepo con Turborepo. Packages compartidos. Cada app es independiente pero comparten lógica.

---

## Árbol Completo

```
whatssound/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint, type-check, test on PR
│   │   ├── deploy-api.yml            # Deploy Fastify to Fly.io
│   │   ├── deploy-web.yml            # Deploy Next.js to Vercel (auto)
│   │   └── eas-build.yml             # EAS Build for mobile
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── apps/
│   ├── mobile/                       # Expo App (iOS + Android)
│   │   ├── app/                      # Expo Router (file-based routing)
│   │   │   ├── (auth)/               # Auth group (no tab bar)
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── welcome.tsx       # Pantalla de bienvenida
│   │   │   │   ├── phone.tsx         # Ingreso de teléfono
│   │   │   │   ├── otp.tsx           # Verificación OTP
│   │   │   │   ├── profile-setup.tsx # Nombre + avatar
│   │   │   │   └── spotify-connect.tsx # Vincular Spotify
│   │   │   │
│   │   │   ├── (tabs)/              # Tab navigator principal
│   │   │   │   ├── _layout.tsx      # Tab bar config
│   │   │   │   ├── index.tsx        # Home / Feed de sesiones
│   │   │   │   ├── search.tsx       # Buscar sesiones / usuarios
│   │   │   │   ├── create.tsx       # Crear sesión (botón central)
│   │   │   │   ├── activity.tsx     # Notificaciones / actividad
│   │   │   │   └── profile.tsx      # Perfil del usuario
│   │   │   │
│   │   │   ├── session/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── index.tsx    # Vista principal de sesión
│   │   │   │   │   ├── queue.tsx    # Cola de música + votación
│   │   │   │   │   ├── chat.tsx     # Chat de la sesión
│   │   │   │   │   ├── members.tsx  # Miembros conectados
│   │   │   │   │   └── settings.tsx # Config de sesión (DJ only)
│   │   │   │   └── join/
│   │   │   │       └── [code].tsx   # Unirse por código/QR
│   │   │   │
│   │   │   ├── user/
│   │   │   │   └── [id].tsx         # Perfil de otro usuario
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── index.tsx        # Settings principal
│   │   │   │   ├── account.tsx      # Cuenta
│   │   │   │   ├── music.tsx        # Servicios de música vinculados
│   │   │   │   ├── notifications.tsx # Preferencias de notificación
│   │   │   │   └── subscription.tsx  # Plan / billing
│   │   │   │
│   │   │   ├── _layout.tsx          # Root layout
│   │   │   └── +not-found.tsx       # 404
│   │   │
│   │   ├── components/              # Componentes específicos de mobile
│   │   │   ├── session/
│   │   │   │   ├── SessionCard.tsx
│   │   │   │   ├── NowPlaying.tsx
│   │   │   │   ├── QueueItem.tsx
│   │   │   │   ├── VoteButton.tsx
│   │   │   │   ├── PlayerControls.tsx
│   │   │   │   └── SessionHeader.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatBubble.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── BottomSheet.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   └── shared/
│   │   │       ├── QRCode.tsx
│   │   │       ├── QRScanner.tsx
│   │   │       ├── TrackSearch.tsx
│   │   │       └── UserAvatar.tsx
│   │   │
│   │   ├── hooks/                   # Hooks específicos de mobile
│   │   │   ├── useAudioPlayer.ts
│   │   │   ├── useSpotifyAuth.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useHaptics.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── colors.ts
│   │   │   └── layout.ts
│   │   │
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   ├── images/
│   │   │   └── animations/          # Lottie files
│   │   │
│   │   ├── app.json
│   │   ├── eas.json
│   │   ├── metro.config.js
│   │   ├── babel.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── web/                         # Next.js App
│       ├── app/
│       │   ├── layout.tsx           # Root layout
│       │   ├── page.tsx             # Landing page
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── callback/page.tsx # OAuth callback
│       │   ├── session/
│       │   │   └── [id]/page.tsx    # Session view (web)
│       │   ├── join/
│       │   │   └── [code]/page.tsx  # Join session via link
│       │   ├── dashboard/           # DJ dashboard
│       │   │   ├── page.tsx
│       │   │   └── analytics/page.tsx
│       │   └── api/
│       │       ├── webhooks/
│       │       │   ├── stripe/route.ts
│       │       │   └── spotify/route.ts
│       │       └── og/
│       │           └── session/[id]/route.tsx  # OG image generation
│       │
│       ├── components/
│       │   └── ...                  # Web-specific components
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared/                      # Código compartido (mobile + web + api)
│   │   ├── src/
│   │   │   ├── types/               # TypeScript types
│   │   │   │   ├── index.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── session.ts
│   │   │   │   ├── track.ts
│   │   │   │   ├── message.ts
│   │   │   │   ├── vote.ts
│   │   │   │   └── subscription.ts
│   │   │   │
│   │   │   ├── schemas/             # Zod schemas (validation + types)
│   │   │   │   ├── index.ts
│   │   │   │   ├── user.schema.ts
│   │   │   │   ├── session.schema.ts
│   │   │   │   ├── track.schema.ts
│   │   │   │   ├── message.schema.ts
│   │   │   │   └── vote.schema.ts
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── index.ts
│   │   │   │   ├── session.ts       # MAX_QUEUE_SIZE, VOTE_COOLDOWN, etc.
│   │   │   │   ├── limits.ts        # Rate limits, max members
│   │   │   │   └── events.ts        # Socket event names (type-safe)
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       ├── format.ts        # Formatters (duration, date, etc.)
│   │   │       ├── validators.ts    # Phone, email validators
│   │   │       └── music.ts         # Track duration formatting, etc.
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api-client/                  # Typed API client (mobile + web)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── client.ts           # Base HTTP client (fetch wrapper)
│   │   │   ├── auth.ts             # Auth API calls
│   │   │   ├── sessions.ts         # Sessions API calls
│   │   │   ├── tracks.ts           # Tracks/search API calls
│   │   │   ├── users.ts            # Users API calls
│   │   │   └── hooks/              # React Query hooks
│   │   │       ├── index.ts
│   │   │       ├── useSession.ts
│   │   │       ├── useSessions.ts
│   │   │       ├── useQueue.ts
│   │   │       ├── useVote.ts
│   │   │       ├── useProfile.ts
│   │   │       └── useSearch.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── realtime/                    # Socket.io event handlers (shared)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── events.ts           # Event type definitions
│   │   │   ├── client.ts           # Socket client setup
│   │   │   └── hooks/
│   │   │       ├── useSocket.ts
│   │   │       ├── useSessionSync.ts
│   │   │       └── usePresence.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ui/                          # Shared UI primitives (Tamagui)
│       ├── src/
│       │   ├── index.ts
│       │   ├── tamagui.config.ts   # Theme, tokens, fonts
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Text.tsx
│       │   ├── Card.tsx
│       │   ├── Avatar.tsx
│       │   └── theme/
│       │       ├── colors.ts
│       │       ├── tokens.ts
│       │       └── fonts.ts
│       │
│       ├── tsconfig.json
│       └── package.json
│
├── services/
│   └── api/                         # Fastify Backend
│       ├── src/
│       │   ├── index.ts             # Server entry point
│       │   ├── app.ts               # Fastify app setup
│       │   │
│       │   ├── plugins/             # Fastify plugins
│       │   │   ├── auth.ts          # JWT verification plugin
│       │   │   ├── cors.ts
│       │   │   ├── rate-limit.ts
│       │   │   ├── socket.ts        # Socket.io integration
│       │   │   ├── sentry.ts        # Error tracking
│       │   │   └── posthog.ts       # Analytics
│       │   │
│       │   ├── routes/              # Route handlers
│       │   │   ├── auth/
│       │   │   │   ├── index.ts     # Auth routes registration
│       │   │   │   ├── phone.ts     # POST /auth/phone (send OTP)
│       │   │   │   ├── verify.ts    # POST /auth/verify (verify OTP)
│       │   │   │   ├── spotify.ts   # OAuth flow for Spotify
│       │   │   │   └── refresh.ts   # POST /auth/refresh
│       │   │   │
│       │   │   ├── sessions/
│       │   │   │   ├── index.ts
│       │   │   │   ├── create.ts    # POST /sessions
│       │   │   │   ├── get.ts       # GET /sessions/:id
│       │   │   │   ├── list.ts      # GET /sessions (feed)
│       │   │   │   ├── join.ts      # POST /sessions/:id/join
│       │   │   │   ├── leave.ts     # POST /sessions/:id/leave
│       │   │   │   └── settings.ts  # PATCH /sessions/:id
│       │   │   │
│       │   │   ├── queue/
│       │   │   │   ├── index.ts
│       │   │   │   ├── add.ts       # POST /sessions/:id/queue
│       │   │   │   ├── vote.ts      # POST /sessions/:id/queue/:trackId/vote
│       │   │   │   ├── skip.ts      # POST /sessions/:id/queue/skip (DJ only)
│       │   │   │   └── reorder.ts   # PATCH /sessions/:id/queue (DJ only)
│       │   │   │
│       │   │   ├── tracks/
│       │   │   │   ├── index.ts
│       │   │   │   └── search.ts    # GET /tracks/search?q=
│       │   │   │
│       │   │   ├── users/
│       │   │   │   ├── index.ts
│       │   │   │   ├── me.ts        # GET /users/me
│       │   │   │   └── profile.ts   # PATCH /users/me
│       │   │   │
│       │   │   └── health.ts        # GET /health
│       │   │
│       │   ├── services/            # Business logic (no HTTP)
│       │   │   ├── session.service.ts
│       │   │   ├── queue.service.ts
│       │   │   ├── vote.service.ts
│       │   │   ├── music.service.ts    # Spotify/Apple abstraction
│       │   │   ├── notification.service.ts
│       │   │   └── subscription.service.ts
│       │   │
│       │   ├── socket/              # Socket.io handlers
│       │   │   ├── index.ts         # Socket server setup
│       │   │   ├── session.handler.ts  # Join/leave session room
│       │   │   ├── playback.handler.ts # Sync playback state
│       │   │   ├── queue.handler.ts    # Real-time queue updates
│       │   │   └── chat.handler.ts     # Chat messages via socket
│       │   │
│       │   ├── jobs/                # Background jobs (BullMQ)
│       │   │   ├── index.ts
│       │   │   ├── send-push.job.ts
│       │   │   ├── cleanup-sessions.job.ts
│       │   │   ├── sync-analytics.job.ts
│       │   │   └── process-webhooks.job.ts
│       │   │
│       │   ├── db/
│       │   │   ├── schema.ts        # Drizzle schema
│       │   │   ├── migrations/      # SQL migrations
│       │   │   ├── seed.ts          # Seed data for dev
│       │   │   └── client.ts        # DB client setup
│       │   │
│       │   ├── lib/
│       │   │   ├── supabase.ts      # Supabase admin client
│       │   │   ├── redis.ts         # Redis client
│       │   │   ├── spotify.ts       # Spotify API wrapper
│       │   │   ├── twilio.ts        # Twilio SMS
│       │   │   ├── fcm.ts           # Firebase push
│       │   │   └── stripe.ts        # Stripe client
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.ts          # JWT verification
│       │   │   ├── session-member.ts # Verify user is session member
│       │   │   └── dj-only.ts       # Verify user is DJ of session
│       │   │
│       │   └── config/
│       │       ├── env.ts           # Typed env variables (zod)
│       │       └── constants.ts
│       │
│       ├── Dockerfile
│       ├── fly.toml
│       ├── drizzle.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── supabase/                        # Supabase local dev + migrations
│   ├── config.toml
│   ├── migrations/
│   │   ├── 00001_initial_schema.sql
│   │   ├── 00002_rls_policies.sql
│   │   ├── 00003_functions.sql
│   │   └── 00004_indexes.sql
│   ├── functions/                   # Edge Functions
│   │   ├── webhook-stripe/index.ts
│   │   └── webhook-revenucat/index.ts
│   └── seed.sql
│
├── turbo.json                       # Turborepo config
├── package.json                     # Root package.json (workspaces)
├── pnpm-workspace.yaml
├── tsconfig.base.json               # Shared TS config
├── .eslintrc.js
├── .prettierrc
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml               # Local dev (Supabase, Redis)
```

---

## Convenciones de Estructura

### Naming
- **Archivos:** `kebab-case.ts` para todo excepto componentes React
- **Componentes React:** `PascalCase.tsx`
- **Hooks:** `useCamelCase.ts`
- **Types:** `PascalCase` en archivos `kebab-case.ts`
- **Constants:** `UPPER_SNAKE_CASE`

### Imports
- Alias `@/` para cada package (resuelve a `src/`)
- Imports relativos solo dentro del mismo directorio
- Barrel exports (`index.ts`) por módulo, nunca en root

### Colocation
- Tests junto al archivo: `session.service.ts` → `session.service.test.ts`
- Storybook junto al componente: `Button.tsx` → `Button.stories.tsx`
- Types junto al módulo, shared types en `packages/shared`
