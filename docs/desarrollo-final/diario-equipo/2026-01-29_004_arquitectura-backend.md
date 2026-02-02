# 🏗️ Arquitectura Backend — WhatsSound MVP

**Fecha:** 2026-01-29  
**Autor:** Arquitecto Backend  
**Estado:** Propuesta MVP

---

## 1. Stack Recomendado

| Componente | Tecnología | Razón |
|---|---|---|
| **Base de datos** | Supabase (PostgreSQL) | Auth integrado, Realtime, Row Level Security, SDK para React Native |
| **Auth** | Supabase Auth (OTP por SMS) | Twilio/MessageBird integrado, sin backend custom |
| **Realtime** | Supabase Realtime + Channels | WebSocket nativo, broadcast y presence |
| **Storage** | Supabase Storage | Avatares, fotos grupo |
| **Pagos** | Stripe Connect | Propinas P2P con split automático |
| **Música** | Spotify Web API + SDK | Búsqueda, metadatos, playback (Premium) |
| **Push** | Expo Notifications + Supabase Edge Functions | Nativo en Expo |
| **API custom** | Supabase Edge Functions (Deno) | Para lógica que no cubre el cliente directo |

---

## 2. Modelos de Datos

### 2.1 `users`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
phone           text UNIQUE NOT NULL
name            text NOT NULL
avatar_url      text
bio             text
favorite_genres text[]          -- ['Reggaeton', 'Pop']
is_dj           boolean DEFAULT false
dj_verified     boolean DEFAULT false
spotify_token   text            -- encrypted, para DJ
stripe_account  text            -- Stripe Connect account id
push_token      text
status          text DEFAULT 'Disponible'
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### 2.2 `follows`
```sql
id              uuid PRIMARY KEY
follower_id     uuid REFERENCES users(id)
following_id    uuid REFERENCES users(id)
created_at      timestamptz DEFAULT now()
UNIQUE(follower_id, following_id)
```

### 2.3 `groups`
```sql
id              uuid PRIMARY KEY
name            text NOT NULL
avatar_url      text
created_by      uuid REFERENCES users(id)
created_at      timestamptz DEFAULT now()
```

### 2.4 `group_members`
```sql
id              uuid PRIMARY KEY
group_id        uuid REFERENCES groups(id) ON DELETE CASCADE
user_id         uuid REFERENCES users(id)
role            text DEFAULT 'member'  -- 'admin' | 'member'
muted           boolean DEFAULT false
joined_at       timestamptz DEFAULT now()
UNIQUE(group_id, user_id)
```

### 2.5 `messages`
```sql
id              uuid PRIMARY KEY
conversation_id uuid NOT NULL      -- group_id o chat directo id
sender_id       uuid REFERENCES users(id)
text            text
type            text DEFAULT 'text' -- 'text' | 'image' | 'audio' | 'system'
media_url       text
read_by         uuid[]             -- para grupo: quién leyó
created_at      timestamptz DEFAULT now()
```
> **Nota:** Para chats 1:1, `conversation_id` = hash determinista de ambos user IDs (sorted).

### 2.6 `conversations` (índice de chats directos)
```sql
id              uuid PRIMARY KEY
type            text NOT NULL       -- 'direct' | 'group'
group_id        uuid REFERENCES groups(id)
participant_ids uuid[]              -- solo para direct (2 users)
last_message_id uuid REFERENCES messages(id)
last_message_at timestamptz
created_at      timestamptz DEFAULT now()
```

### 2.7 `sessions` (sesiones musicales)
```sql
id              uuid PRIMARY KEY
name            text NOT NULL
dj_id           uuid REFERENCES users(id)
group_id        uuid REFERENCES groups(id)  -- NULL = sesión pública independiente
genre           text NOT NULL
is_public       boolean DEFAULT true
allow_requests  boolean DEFAULT true
allow_chat      boolean DEFAULT true
status          text DEFAULT 'live'  -- 'live' | 'paused' | 'ended'
listener_count  integer DEFAULT 0
share_code      text UNIQUE          -- código corto para QR/link
started_at      timestamptz DEFAULT now()
ended_at        timestamptz
```

### 2.8 `session_listeners`
```sql
id              uuid PRIMARY KEY
session_id      uuid REFERENCES sessions(id) ON DELETE CASCADE
user_id         uuid REFERENCES users(id)
joined_at       timestamptz DEFAULT now()
left_at         timestamptz
UNIQUE(session_id, user_id)
```

### 2.9 `queue_songs` (cola de canciones)
```sql
id              uuid PRIMARY KEY
session_id      uuid REFERENCES sessions(id) ON DELETE CASCADE
spotify_track_id text NOT NULL
title           text NOT NULL
artist          text NOT NULL
album           text
duration_ms     integer
cover_url       text
requested_by    uuid REFERENCES users(id)
votes           integer DEFAULT 0
status          text DEFAULT 'queued'  -- 'queued' | 'playing' | 'played' | 'skipped'
position        integer                -- orden en cola
created_at      timestamptz DEFAULT now()
played_at       timestamptz
```

### 2.10 `song_votes`
```sql
id              uuid PRIMARY KEY
song_id         uuid REFERENCES queue_songs(id) ON DELETE CASCADE
user_id         uuid REFERENCES users(id)
created_at      timestamptz DEFAULT now()
UNIQUE(song_id, user_id)
```

### 2.11 `tips` (propinas)
```sql
id              uuid PRIMARY KEY
from_user_id    uuid REFERENCES users(id)
to_user_id      uuid REFERENCES users(id)  -- DJ
session_id      uuid REFERENCES sessions(id)
amount_cents    integer NOT NULL
currency        text DEFAULT 'EUR'
message         text
stripe_payment_id text
status          text DEFAULT 'pending'  -- 'pending' | 'completed' | 'failed'
created_at      timestamptz DEFAULT now()
```

### 2.12 `notifications`
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES users(id)
type            text NOT NULL  -- 'session' | 'tip' | 'mention' | 'invite' | 'follow' | 'event'
title           text NOT NULL
body            text NOT NULL
data            jsonb          -- { session_id, group_id, etc. }
read            boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

### 2.13 `events` (sesiones programadas)
```sql
id              uuid PRIMARY KEY
name            text NOT NULL
dj_id           uuid REFERENCES users(id)
genre           text
scheduled_at    timestamptz NOT NULL
session_id      uuid REFERENCES sessions(id)  -- se llena cuando empieza
created_at      timestamptz DEFAULT now()
```

### 2.14 `event_interests`
```sql
id              uuid PRIMARY KEY
event_id        uuid REFERENCES events(id) ON DELETE CASCADE
user_id         uuid REFERENCES users(id)
notify          boolean DEFAULT true
UNIQUE(event_id, user_id)
```

---

## 3. Endpoints API REST

La mayoría de operaciones CRUD van directo contra Supabase con RLS. Los endpoints custom son Edge Functions.

### 3.1 Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/otp` | Enviar OTP por SMS (Supabase Auth nativo) |
| POST | `/auth/verify` | Verificar OTP |
| POST | `/auth/profile` | Crear/actualizar perfil post-registro |

### 3.2 Users
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/users/:id` | Perfil público (stats, sesiones, géneros) |
| PATCH | `/users/me` | Actualizar mi perfil |
| POST | `/users/:id/follow` | Seguir usuario |
| DELETE | `/users/:id/follow` | Dejar de seguir |
| GET | `/users/:id/followers` | Lista seguidores |

### 3.3 Groups
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/groups` | Crear grupo |
| GET | `/groups` | Mis grupos |
| GET | `/groups/:id` | Detalle grupo + miembros |
| PATCH | `/groups/:id` | Editar nombre/avatar |
| POST | `/groups/:id/members` | Añadir miembros |
| DELETE | `/groups/:id/members/:userId` | Expulsar/salir |

### 3.4 Messages / Conversations
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/conversations` | Lista de conversaciones (chats + grupos) con último mensaje |
| GET | `/conversations/:id/messages` | Mensajes paginados (cursor) |
| POST | `/conversations/:id/messages` | Enviar mensaje (o via Realtime) |
| PATCH | `/conversations/:id/read` | Marcar como leído |

### 3.5 Sessions (Edge Functions)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/fn/sessions` | Crear sesión (genera share_code) |
| GET | `/fn/sessions/live` | Sesiones en vivo (filtros: público, mis grupos, género) |
| GET | `/fn/sessions/:id` | Detalle sesión + cola actual |
| POST | `/fn/sessions/:id/join` | Unirse (incrementa listener_count) |
| POST | `/fn/sessions/:id/leave` | Salirse |
| POST | `/fn/sessions/:id/end` | Finalizar sesión (solo DJ) |
| GET | `/fn/sessions/code/:code` | Buscar sesión por share_code (QR) |

### 3.6 Queue / Songs
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/fn/sessions/:id/queue` | Cola ordenada por votos |
| POST | `/fn/sessions/:id/queue` | Pedir canción |
| POST | `/fn/sessions/:id/queue/:songId/vote` | Votar canción |
| DELETE | `/fn/sessions/:id/queue/:songId/vote` | Quitar voto |
| POST | `/fn/sessions/:id/queue/next` | Pasar a siguiente (solo DJ) |
| POST | `/fn/sessions/:id/queue/:songId/skip` | Saltar canción (solo DJ) |

### 3.7 Tips (Edge Functions — Stripe)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/fn/tips/create-intent` | Crear PaymentIntent (Stripe) |
| POST | `/fn/tips/confirm` | Confirmar pago completado |
| GET | `/fn/tips/history` | Historial propinas enviadas/recibidas |

### 3.8 Spotify (Edge Functions — proxy)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/fn/spotify/search?q=` | Buscar canciones |
| POST | `/fn/spotify/play` | Reproducir track (DJ, requiere Premium) |
| POST | `/fn/spotify/pause` | Pausar (DJ) |
| POST | `/fn/spotify/next` | Siguiente (DJ) |
| GET | `/fn/spotify/callback` | OAuth callback para conectar Spotify |

### 3.9 Notifications
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/notifications` | Mis notificaciones (paginadas) |
| PATCH | `/notifications/read-all` | Marcar todas como leídas |

### 3.10 Discover
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/fn/discover/djs` | Top DJs (por sesiones, rating) |
| GET | `/fn/discover/events` | Próximos eventos |
| POST | `/fn/events/:id/interest` | Marcar interés en evento |

---

## 4. Eventos WebSocket (Supabase Realtime)

Usamos **Channels** de Supabase Realtime con 3 patrones:

### 4.1 Canal de Sesión: `session:{session_id}`

| Evento | Payload | Dirección |
|---|---|---|
| `song:changed` | `{ track_id, title, artist, cover_url, progress }` | Server → Client |
| `song:progress` | `{ progress_ms, duration_ms }` | Server → Client (cada 5s) |
| `queue:updated` | `{ queue: Song[] }` | Server → Client |
| `vote:added` | `{ song_id, votes, user_id }` | Server → Client |
| `vote:removed` | `{ song_id, votes, user_id }` | Server → Client |
| `listener:joined` | `{ user_id, name, count }` | Server → Client |
| `listener:left` | `{ user_id, count }` | Server → Client |
| `session:ended` | `{ duration, total_listeners }` | Server → Client |
| `tip:received` | `{ from_name, amount, message }` | Server → Client (broadcast) |

### 4.2 Canal de Chat: `chat:{conversation_id}`

| Evento | Payload | Dirección |
|---|---|---|
| `message:new` | `{ id, sender_id, sender_name, text, type, time }` | Bidireccional |
| `message:read` | `{ user_id, last_read_id }` | Client → Server |
| `typing` | `{ user_id, name }` | Client → Server (broadcast) |
| `typing:stop` | `{ user_id }` | Client → Server (broadcast) |

### 4.3 Presence (Supabase Presence)

Canal `session:{session_id}` con Presence track:
```json
{
  "user_id": "abc",
  "name": "Carlos",
  "avatar_url": "...",
  "joined_at": "2026-01-29T19:00:00Z"
}
```
→ Permite lista de oyentes en tiempo real sin polling.

### 4.4 Canal de Usuario: `user:{user_id}` (notificaciones push en-app)

| Evento | Payload |
|---|---|
| `notification:new` | `{ id, type, title, body, data }` |

---

## 5. Integración Spotify API

### Flujo DJ:
1. DJ conecta Spotify via OAuth 2.0 (PKCE) → `GET /fn/spotify/callback`
2. Token se guarda en `users.spotify_token` (encrypted)
3. Edge Function actúa como proxy: refresh tokens, búsqueda, playback
4. El DJ controla playback desde la app → Edge Function → Spotify API

### Flujo Oyentes:
- **No necesitan Spotify.** Solo ven metadatos (título, artista, cover).
- La búsqueda al pedir canción usa el token del DJ (o un token de app para search).

### Endpoints Spotify usados:
| Endpoint Spotify | Uso |
|---|---|
| `GET /v1/search` | Buscar canciones para peticiones |
| `PUT /v1/me/player/play` | Reproducir track (DJ) |
| `PUT /v1/me/player/pause` | Pausar (DJ) |
| `POST /v1/me/player/next` | Siguiente (DJ) |
| `GET /v1/me/player` | Estado actual playback |

---

## 6. Diagrama de Flujo de Datos

```
┌─────────────┐     ┌──────────────────────────────────┐
│  React      │     │         SUPABASE                  │
│  Native     │     │                                   │
│  (Expo)     │     │  ┌─────────────┐                 │
│             │────▶│  │  Auth (OTP) │                 │
│  Screens:   │     │  └─────────────┘                 │
│  - Auth     │     │                                   │
│  - Chats    │     │  ┌─────────────┐  ┌───────────┐ │
│  - Live     │◀──▶│  │  Realtime   │  │ PostgreSQL│ │
│  - Session  │     │  │  (WS)      │  │           │ │
│  - Discover │     │  │  channels  │  │ users     │ │
│  - Profile  │     │  │  presence  │  │ groups    │ │
│             │     │  └─────────────┘  │ messages  │ │
│             │     │                    │ sessions  │ │
│             │────▶│  ┌─────────────┐  │ queue     │ │
│             │     │  │Edge Functions│  │ tips      │ │
│             │◀───│  │             │  │ notifs    │ │
│             │     │  │ - sessions  │──▶│           │ │
│             │     │  │ - tips      │  └───────────┘ │
│             │     │  │ - spotify   │                 │
│             │     │  │ - discover  │  ┌───────────┐ │
│             │     │  │             │  │  Storage  │ │
│             │     │  └──────┬──────┘  │ (avatars) │ │
│             │     │         │         └───────────┘ │
└─────────────┘     └─────────┼────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Spotify Web API  │
                    │   - Search         │
                    │   - Playback       │
                    │   - OAuth          │
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Stripe Connect   │
                    │   - PaymentIntents │
                    │   - Transfers      │
                    └───────────────────┘
```

### Flujo típico — Usuario pide canción:

```
User → POST /fn/sessions/:id/queue { spotify_track_id }
  → Edge Function valida sesión activa + allow_requests
  → INSERT queue_songs
  → Broadcast canal session:{id} → evento queue:updated
  → Todos los oyentes reciben cola actualizada
```

### Flujo típico — DJ pasa canción:

```
DJ → POST /fn/sessions/:id/queue/next
  → Edge Function:
    1. Marca actual como 'played'
    2. Toma siguiente por votos (ORDER BY votes DESC, created_at ASC)
    3. Marca como 'playing'
    4. PUT Spotify /v1/me/player/play { track_uri }
    5. Broadcast session:{id} → song:changed + queue:updated
```

---

## 7. Row Level Security (RLS) — Reglas clave

```sql
-- Users: cualquiera lee perfiles públicos, solo tú editas el tuyo
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON users FOR SELECT USING (true);
CREATE POLICY "Self update" ON users FOR UPDATE USING (auth.uid() = id);

-- Messages: solo miembros de la conversación
CREATE POLICY "Members read" ON messages FOR SELECT
  USING (sender_id = auth.uid() OR conversation_id IN (
    SELECT id FROM conversations WHERE auth.uid() = ANY(participant_ids)
    UNION
    SELECT g.id FROM groups g JOIN group_members gm ON g.id = gm.group_id WHERE gm.user_id = auth.uid()
  ));

-- Sessions: públicas para todos, privadas solo miembros del grupo
CREATE POLICY "Session read" ON sessions FOR SELECT
  USING (is_public = true OR group_id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  ));
```

---

## 8. Prioridades MVP

### Fase 1 — Core (2 semanas)
- [ ] Auth OTP + perfil
- [ ] Crear/listar sesiones
- [ ] Unirse a sesión
- [ ] Chat en sesión (Realtime)
- [ ] Cola de canciones + votos
- [ ] Búsqueda Spotify (search)

### Fase 2 — Social (1 semana)
- [ ] Grupos + chat grupo
- [ ] Chat 1:1
- [ ] Lista conversaciones
- [ ] Notificaciones in-app

### Fase 3 — Monetización (1 semana)
- [ ] Propinas con Stripe
- [ ] Perfil DJ con stats
- [ ] Discover (DJs, eventos)

### Fase 4 — Polish
- [ ] Playback real Spotify (DJ Premium)
- [ ] Push notifications
- [ ] QR compartir sesión
- [ ] Eventos programados

---

> **Decisión clave:** Supabase sobre Firebase porque: SQL > NoSQL para queries complejas (cola ordenada por votos, discover con filtros), RLS nativo, y Realtime channels cubren todos los casos de WebSocket sin servidor custom.
