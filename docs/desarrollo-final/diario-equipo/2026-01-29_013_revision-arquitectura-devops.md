# 📋 Revisión Arquitectura & DevOps — WhatsSound App

**Fecha:** 2026-01-29  
**Autor:** Arquitecto Backend / DevOps  
**Sprint:** 013  
**Estado:** Revisión técnica formal del frontend antes de integración backend

---

## 1. 🏗️ Arquitectura Actual

### Estructura de carpetas

```
whatssound-app/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout (QueryClient, Stack)
│   ├── (auth)/                   # Auth flow: splash, login, otp, onboarding, create-profile
│   ├── (tabs)/                   # Tab navigator: chats, live, groups, discover, history, settings
│   ├── session/                  # Session screens: [id], create, queue, request-song, rate, stats, send-tip, share-qr, dj-panel
│   ├── chat/                     # 1:1 chat: [id], media
│   ├── group/                    # Group: [id], create, info
│   ├── profile/                  # Profile: [id], followers
│   ├── event/                    # Event detail: [id]
│   ├── settings/                 # Settings sub-screens (8 pantallas)
│   └── search.tsx, notifications.tsx, edit-profile.tsx
├── src/
│   ├── components/ui/            # Design system: Button, Input, Avatar, Card, Badge, Modal, Toast, EmptyState, BottomSheet
│   └── theme/                    # colors.ts, typography.ts, spacing.ts
├── assets/                       # icon.png, adaptive-icon.png, splash-icon.png, favicon.png
├── .github/workflows/            # ci.yml, deploy-preview.yml
├── docker-compose.yml            # Supabase DB + Studio + Stripe CLI
└── .env.example                  # Supabase, Spotify, Stripe, Expo tokens
```

### Patrones identificados

| Patrón | Estado | Notas |
|--------|--------|-------|
| File-based routing (Expo Router) | ✅ Bien implementado | Grupos `(auth)`, `(tabs)`, rutas dinámicas `[id]` |
| Design System centralizado | ✅ Sólido | 9 componentes UI reutilizables + theme tokens |
| State management (Zustand) | ⚠️ Instalado, NO usado | 0 stores creados — todo es `useState` local |
| React Query | ⚠️ Provider existe, NO usado | `QueryClientProvider` en root, 0 `useQuery` calls |
| Separación concerns | ⚠️ Parcial | No hay carpeta `services/`, `hooks/`, `stores/`, `utils/`, `types/` |

### Evaluación

**Lo bueno:**
- Routing bien estructurado con grupos lógicos
- Design system consistente con theme tokens (colors, typography, spacing)
- Componentes UI reutilizables con variantes
- Buena cobertura de pantallas (~30 screens)

**Lo que falta:**
- No existe capa de servicios/API
- No hay custom hooks compartidos
- No hay tipos/interfaces globales (cada pantalla define las suyas inline)
- No hay separación datos/presentación — todo vive en los componentes de pantalla

---

## 2. 🔌 Preparación para Backend

### Datos Mock Identificados

**TODOS los datos son mock.** No hay una sola llamada a API, Supabase, ni fetch. Cada pantalla define sus arrays hardcodeados inline:

| Pantalla | Datos Mock | Entidades implícitas |
|----------|-----------|---------------------|
| `(tabs)/index.tsx` | `CHATS[]` — 10 chats | Chat, User, Group |
| `(tabs)/live.tsx` | `SESSIONS[]` — 5 sesiones | LiveSession, DJ, Song |
| `(tabs)/groups.tsx` | `GROUPS[]` — 7 grupos | Group, MusicSession |
| `(tabs)/discover.tsx` | `UPCOMING[]`, `TOP_DJS[]`, `GENRES[]` | Event, DJ, Genre |
| `session/[id].tsx` | `MOCK_MESSAGES[]`, `MOCK_SESSION` | SessionMessage, Session |
| `session/queue.tsx` | `MOCK_QUEUE[]` — 7 canciones | QueuedSong, Vote |
| `session/send-tip.tsx` | `AMOUNTS[]`, DJ hardcodeado | Tip, Payment |
| `chat/[id].tsx` | `MESSAGES[]` — 10 mensajes | DirectMessage |
| `group/[id].tsx` | `MESSAGES[]` — 11 mensajes | GroupMessage |
| `profile/[id].tsx` | Stats hardcodeados, sesiones recientes | UserProfile, DJStats |
| `event/[id].tsx` | Evento hardcodeado completo | Event, Attendee |
| `(auth)/login.tsx` | `COUNTRIES[]` — 19 países | Country (static) |

### Qué necesita API real (priorizado)

1. **Auth** — Login por teléfono + OTP (Supabase Auth con SMS provider)
2. **Sesiones en vivo** — CRUD + Realtime (Supabase Realtime channels)
3. **Chat/Mensajes** — Realtime bidireccional (Supabase Realtime)
4. **Cola de canciones** — CRUD + voting + ordenamiento en tiempo real
5. **Perfiles/DJs** — CRUD usuarios + stats agregados
6. **Propinas** — Stripe Payment Intents
7. **Eventos** — CRUD + interesados + recordatorios (push notifications)
8. **Grupos** — CRUD + membresía + vinculación con sesiones
9. **Búsqueda** — Full-text search (Supabase pg_trgm o Algolia)
10. **Spotify** — OAuth + search API para peticiones de canciones

### Esquema de datos implícito

```typescript
// Entidades principales inferidas del código
User { id, phone, name, avatar_url, bio, is_dj, is_verified, created_at }
Group { id, name, members_count, created_by, created_at }
GroupMember { group_id, user_id, role, joined_at, muted }
Session { id, name, dj_id, group_id?, genre, is_public, allow_requests, allow_chat, status, listeners_count, created_at }
Song { id, title, artist, duration, spotify_id? }
QueueItem { id, session_id, song_id, requested_by, votes_count, status, position, created_at }
Vote { queue_item_id, user_id, created_at }
Message { id, session_id?, group_id?, chat_id?, sender_id, text, type, created_at }
Chat { id, user1_id, user2_id, last_message_at }
Tip { id, session_id, from_user_id, to_dj_id, amount, currency, message?, stripe_payment_id, created_at }
Event { id, name, dj_id, genre, description, starts_at, ends_at, is_public, created_at }
EventAttendee { event_id, user_id, interested, reminder, created_at }
Follow { follower_id, following_id, created_at }
Notification { id, user_id, type, title, body, data, read, created_at }
```

---

## 3. 📈 Escalabilidad

### Problemas detectados

| Issue | Ubicación | Severidad | Descripción |
|-------|-----------|-----------|-------------|
| **Datos inline** | Todas las pantallas | 🔴 Crítico | Arrays mock hardcodeados — imposible paginar, cachear o sincronizar |
| **Sin virtualización adecuada** | `discover.tsx` | 🟡 Medio | Usa `ScrollView` con `.map()` en vez de `FlatList` para listas largas (DJs, eventos) |
| **Re-renders innecesarios** | `session/[id].tsx` | 🟡 Medio | `messages` en estado local, cada mensaje nuevo re-renderiza toda la lista |
| **Sin paginación** | Todas las FlatList | 🟡 Medio | Ninguna FlatList implementa `onEndReached` / infinite scroll |
| **Sin memoización** | `ChatItem`, `GroupItem`, `SongItem` | 🟡 Medio | Componentes de lista no usan `React.memo` — re-render en cada update |
| **Sorting en cliente** | `queue.tsx` | 🟠 Bajo | `handleVote` ordena array completo en cada voto — no escala con colas grandes |
| **QueryClient sin config** | `_layout.tsx` | 🟠 Bajo | `new QueryClient()` sin staleTime, retry, cacheTime custom |
| **Zustand sin usar** | Global | 🟠 Bajo | Dependencia instalada pero 0 stores — estado global inexistente |

### Recomendaciones

1. **Extraer datos a hooks** con React Query: `useChats()`, `useLiveSessions()`, `useQueue(sessionId)`, etc.
2. **Implementar Zustand stores** para: auth state, current session, UI state (modals, filters)
3. **Agregar `React.memo`** a todos los componentes de lista renderizados por FlatList
4. **Usar `useCallback`** para handlers pasados a items de lista
5. **FlatList configs**: `getItemLayout`, `maxToRenderPerBatch`, `windowSize` para listas largas
6. **Paginación**: cursor-based con `onEndReached` + React Query `useInfiniteQuery`

---

## 4. 🔒 Seguridad

### Hallazgos

| Issue | Severidad | Detalle |
|-------|-----------|---------|
| **Sin validación de inputs** | 🔴 Crítico | `login.tsx`: solo valida `phone.length < 6`, sin regex ni sanitización |
| **Sin sanitización de mensajes** | 🔴 Crítico | Chat acepta cualquier texto — XSS potencial si se renderiza HTML |
| **OTP simulado** | 🔴 Crítico | `setTimeout` simula envío OTP — no hay verificación real |
| **Sin rate limiting** | 🟡 Medio | Formularios de login, tip, mensajes sin throttle/debounce |
| **Sin auth guard** | 🟡 Medio | No hay middleware/guard que redirija a login si no autenticado |
| **Propinas sin validación** | 🟡 Medio | `send-tip.tsx`: acepta cualquier número sin límites min/max |
| **`.env.example` con placeholders** | ✅ OK | Tokens son placeholder, no hardcodeados |
| **No hay `.env` commiteado** | ✅ OK | `.gitignore` presente |
| **Stripe secret en .env.example** | ⚠️ Nota | `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` no deben estar en frontend — deben ser solo para Edge Functions |

### Recomendaciones

1. **Auth guard** en `_layout.tsx`: comprobar sesión Supabase antes de renderizar `(tabs)`
2. **Validación de teléfono**: regex por país, limitar caracteres
3. **Rate limiting**: debounce en envío de mensajes (300ms), throttle en votaciones
4. **Sanitización**: strip HTML tags de inputs de texto
5. **Límites en propinas**: min €0.50, max €100 — validar en frontend Y backend
6. **Variables sensibles**: mover `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `SPOTIFY_CLIENT_SECRET` exclusivamente a Supabase Edge Functions / servidor

---

## 5. 🚀 Deployment Readiness

### Expo / EAS Build

| Requisito | Estado | Notas |
|-----------|--------|-------|
| `app.json` completo | ⚠️ Parcial | Tiene name, slug, icon, splash, scheme, bundleId — **falta `version`, `owner`, `extra`, `updates`** |
| `eas.json` | ❌ No existe | Necesario para `eas build` — perfiles development, preview, production |
| Icons (1024x1024) | ⚠️ Sin verificar | `assets/icon.png` existe pero no se verificó resolución |
| Adaptive Icon Android | ✅ Presente | `assets/adaptive-icon.png` |
| Splash screen | ✅ Configurado | `assets/splash-icon.png` con `backgroundColor: #0B141A` |
| Deep linking scheme | ✅ | `whatssound://` configurado |
| New Architecture | ✅ | `newArchEnabled: true` |
| CI/CD workflows | ✅ Sólido | `ci.yml` (lint+typecheck+test+web build+EAS), `deploy-preview.yml` (Vercel+EAS Update) |
| Docker compose | ✅ | Supabase DB + Studio + Stripe CLI local |
| Expo SDK | ✅ | SDK 54 (current) |

### Faltantes para build nativo

```bash
# 1. Crear eas.json
eas build:configure

# 2. Completar app.json
{
  "expo": {
    "owner": "whatssound",           # ← Cuenta Expo
    "version": "0.1.0",
    "runtimeVersion": "0.1.0",       # ← Para EAS Update
    "updates": {
      "url": "https://u.expo.dev/PROJECT_ID"
    },
    "extra": {
      "eas": { "projectId": "xxx" }
    }
  }
}

# 3. Registrar en Expo
eas login
eas build --platform all --profile preview
```

### Faltantes para producción

- [ ] App Store screenshots
- [ ] Privacy policy URL (en `app.json` > `ios.privacyManifests`)
- [ ] Push notification certificates (iOS)
- [ ] Google Services JSON (Android — si se usa Firebase)
- [ ] Sentry / error tracking
- [ ] Analytics (Mixpanel, Amplitude, o PostHog)

---

## 6. 🗄️ Supabase Schema — Propuesta SQL

```sql
-- ============================================
-- WhatsSound — Supabase Database Schema
-- Basado en entidades detectadas en el frontend
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Full-text search

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_dj BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  dj_genre TEXT,           -- Géneros principales si es DJ
  total_sessions INT DEFAULT 0,
  avg_rating DECIMAL(2,1) DEFAULT 0.0,
  total_listeners INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_profiles_is_dj ON public.profiles(is_dj) WHERE is_dj = TRUE;
CREATE INDEX idx_profiles_name_trgm ON public.profiles USING gin(display_name gin_trgm_ops);

-- ============================================
-- FOLLOWS
-- ============================================

CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================
-- GROUPS & MEMBERSHIP
-- ============================================

CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  members_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.group_members (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- ============================================
-- CHATS (1:1)
-- ============================================

CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user1_id, user2_id),
  CHECK (user1_id < user2_id)  -- Canonical ordering
);

-- ============================================
-- MESSAGES (unified: chat, group, session)
-- ============================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Polymorphic: exactly one must be set
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),  -- NULL for system messages
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'audio', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (chat_id IS NOT NULL)::int +
    (group_id IS NOT NULL)::int +
    (session_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX idx_messages_chat ON public.messages(chat_id, created_at DESC) WHERE chat_id IS NOT NULL;
CREATE INDEX idx_messages_group ON public.messages(group_id, created_at DESC) WHERE group_id IS NOT NULL;
CREATE INDEX idx_messages_session ON public.messages(session_id, created_at DESC) WHERE session_id IS NOT NULL;

-- ============================================
-- SESSIONS (Live DJ sessions)
-- ============================================

CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dj_id UUID NOT NULL REFERENCES public.profiles(id),
  group_id UUID REFERENCES public.groups(id),  -- Optional: session from group
  genre TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  allow_requests BOOLEAN DEFAULT TRUE,
  allow_chat BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'live' CHECK (status IN ('live', 'ended', 'paused')),
  listeners_count INT DEFAULT 0,
  current_song_title TEXT,
  current_song_artist TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_status ON public.sessions(status) WHERE status = 'live';
CREATE INDEX idx_sessions_dj ON public.sessions(dj_id);

-- ============================================
-- SONG QUEUE & VOTES
-- ============================================

CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration_seconds INT,
  spotify_id TEXT UNIQUE,
  album_art_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_songs_spotify ON public.songs(spotify_id) WHERE spotify_id IS NOT NULL;
CREATE INDEX idx_songs_search ON public.songs USING gin((title || ' ' || artist) gin_trgm_ops);

CREATE TABLE public.queue_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id),
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  votes_count INT DEFAULT 0,
  status TEXT DEFAULT 'queued' CHECK (status IN ('playing', 'next', 'queued', 'played', 'skipped')),
  position INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_queue_session ON public.queue_items(session_id, status, votes_count DESC);

CREATE TABLE public.votes (
  queue_item_id UUID REFERENCES public.queue_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (queue_item_id, user_id)
);

-- ============================================
-- TIPS (Payments)
-- ============================================

CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id),
  from_user_id UUID NOT NULL REFERENCES public.profiles(id),
  to_dj_id UUID NOT NULL REFERENCES public.profiles(id),
  amount_cents INT NOT NULL CHECK (amount_cents >= 50),  -- Min €0.50
  currency TEXT DEFAULT 'eur',
  message TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS (Scheduled sessions)
-- ============================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dj_id UUID NOT NULL REFERENCES public.profiles(id),
  genre TEXT,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT TRUE,
  attendees_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_upcoming ON public.events(starts_at) WHERE starts_at > NOW();

CREATE TABLE public.event_attendees (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interested BOOLEAN DEFAULT TRUE,
  reminder BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'session_start', 'tip_received', 'follow', 'event_reminder', etc.
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,          -- Flexible payload for deep links
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY "Public profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Messages: can read if participant
CREATE POLICY "Chat messages" ON public.messages FOR SELECT USING (
  (chat_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.chats WHERE id = chat_id AND (user1_id = auth.uid() OR user2_id = auth.uid())
  ))
  OR (group_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.group_members WHERE group_id = messages.group_id AND user_id = auth.uid()
  ))
  OR (session_id IS NOT NULL)  -- Session messages are public if session is public
);

-- Notifications: only own
CREATE POLICY "Own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- Tips: own tips or received tips
CREATE POLICY "Own tips" ON public.tips FOR SELECT USING (
  from_user_id = auth.uid() OR to_dj_id = auth.uid()
);
```

### Realtime Channels necesarios

| Channel | Uso | Tabla/Custom |
|---------|-----|--------------|
| `session:{id}:messages` | Chat de sesión en vivo | `messages` WHERE session_id |
| `session:{id}:queue` | Cola de canciones en tiempo real | `queue_items` WHERE session_id |
| `session:{id}:meta` | Listeners count, current song | Custom broadcast |
| `group:{id}:messages` | Chat de grupo | `messages` WHERE group_id |
| `chat:{id}:messages` | Chat 1:1 | `messages` WHERE chat_id |
| `user:{id}:notifications` | Push notifications in-app | `notifications` WHERE user_id |

---

## 7. 📏 Recomendaciones de Estándares

### ESLint & Prettier

```bash
# Instalar
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-native \
  prettier eslint-config-prettier eslint-plugin-prettier

# Configurar .eslintrc.js
module.exports = {
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

### Testing

**Estado actual:** 0 tests. `jest --passWithNoTests` en CI.

**Plan recomendado:**

| Capa | Herramienta | Prioridad | Target |
|------|-------------|-----------|--------|
| Unit tests | Jest + Testing Library | 🔴 Alta | Hooks, utils, stores |
| Component tests | React Native Testing Library | 🟡 Media | UI components, forms |
| E2E tests | Maestro | 🟠 Baja | Flows críticos (login, create session, tip) |

```bash
npm install -D jest @testing-library/react-native @testing-library/jest-native
```

### CI/CD

**Estado actual:** Buena base con 2 workflows.

**Mejoras recomendadas:**

1. **Activar ESLint** — quitar `continue-on-error: true` del CI una vez configurado
2. **Agregar test coverage** — `jest --coverage` con umbral mínimo (60% → 80% progresivo)
3. **Build iOS en CI** — agregar `eas build --platform ios --profile preview` (necesita Apple credentials)
4. **Dependabot** — `.github/dependabot.yml` para updates automáticos de npm
5. **Branch protection** — Require CI pass + 1 approval en `main`

### Convenciones de código pendientes

| Convención | Estado | Acción |
|------------|--------|--------|
| Tipos globales compartidos | ❌ | Crear `src/types/` con interfaces de dominio |
| Custom hooks | ❌ | Crear `src/hooks/` — extraer lógica de pantallas |
| Services layer | ❌ | Crear `src/services/` — Supabase client, API wrappers |
| Stores (Zustand) | ❌ | Crear `src/stores/` — auth, session, ui |
| Constants | ❌ | Crear `src/constants/` — genres, countries, config |
| Error boundaries | ❌ | Agregar ErrorBoundary global y por sección |
| Loading states | ⚠️ Parcial | Solo en botones — faltan skeletons, shimmer |

---

## 📊 Resumen Ejecutivo

| Área | Puntuación | Nota |
|------|-----------|------|
| **UI/UX completeness** | 9/10 | ~30 pantallas funcionales, design system sólido |
| **Arquitectura** | 5/10 | Sin capas de servicio, hooks, stores, tipos |
| **Backend readiness** | 2/10 | 100% mock, 0 API calls, 0 auth real |
| **Escalabilidad** | 4/10 | FlatList básico, sin memo, sin paginación |
| **Seguridad** | 3/10 | Sin auth guard, sin validación, sin rate limiting |
| **Deployment** | 6/10 | CI/CD existe, falta eas.json y config completa |
| **Testing** | 0/10 | 0 tests |
| **Código limpio** | 6/10 | Consistente pero sin ESLint/Prettier enforced |

### Próximos pasos prioritarios (orden sugerido)

1. **Crear estructura de carpetas** — `src/{services,hooks,stores,types,constants}/`
2. **Configurar Supabase** — `supabase init`, migrar schema SQL, `supabase start`
3. **Implementar Auth** — Supabase Auth phone + OTP, auth guard en layout
4. **Extraer datos a React Query** — empezar con sessions y chats
5. **Crear Zustand stores** — auth, currentSession, UI
6. **Configurar ESLint + Prettier** — enforced en CI
7. **Crear `eas.json`** — profiles dev, preview, production
8. **Escribir primeros tests** — auth flow, queue voting logic

---

*Revisión generada el 2026-01-29 por el Arquitecto Backend/DevOps del equipo WhatsSound.*
