# WhatsSound — Patrones de Código

---

## 1. Estado: Zustand + React Query

### Regla de oro
- **Server state** (datos del API) → React Query
- **Client state** (UI, preferencias) → Zustand
- **NUNCA duplicar** server state en Zustand

```typescript
// ✅ CORRECTO — React Query para server state
function useSession(id: string) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => api.sessions.get(id),
    staleTime: 30_000,
  });
}

// ✅ CORRECTO — Zustand para client state
const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 0.8,
      isMinimized: false,
      setVolume: (volume: number) => set({ volume }),
      toggleMinimized: () => set((s) => ({ isMinimized: !s.isMinimized })),
    }),
    { name: 'player-store', storage: createMMKVStorage() }
  )
);
```

### Optimistic Updates (votación)
```typescript
function useVote(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trackId: string) => api.queue.vote(sessionId, trackId),
    onMutate: async (trackId) => {
      await queryClient.cancelQueries({ queryKey: ['queue', sessionId] });
      const previous = queryClient.getQueryData<Queue>(['queue', sessionId]);

      queryClient.setQueryData<Queue>(['queue', sessionId], (old) => {
        if (!old) return old;
        return {
          ...old,
          tracks: old.tracks.map((t) =>
            t.id === trackId ? { ...t, votes: t.votes + 1, hasVoted: true } : t
          ).sort((a, b) => b.votes - a.votes),
        };
      });

      return { previous };
    },
    onError: (_err, _trackId, context) => {
      queryClient.setQueryData(['queue', sessionId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', sessionId] });
    },
  });
}
```

---

## 2. API Layer: Typed Client

```typescript
// packages/api-client/src/client.ts
class ApiClient {
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  constructor(config: { baseUrl: string; getToken: () => Promise<string | null> }) {
    this.baseUrl = config.baseUrl;
    this.getToken = config.getToken;
  }

  async request<T>(path: string, options: RequestInit & { schema?: ZodSchema<T> } = {}): Promise<T> {
    const token = await this.getToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message ?? 'Unknown error', error.code);
    }

    const data = await response.json();
    return options.schema ? options.schema.parse(data) : data;
  }
}
```

---

## 3. Socket Events: Type-Safe

```typescript
// packages/shared/src/constants/events.ts
export const SOCKET_EVENTS = {
  // Session lifecycle
  SESSION_JOIN: 'session:join',
  SESSION_LEAVE: 'session:leave',
  SESSION_UPDATE: 'session:update',

  // Playback sync
  PLAYBACK_STATE: 'playback:state',
  PLAYBACK_SEEK: 'playback:seek',
  PLAYBACK_NEXT: 'playback:next',

  // Queue
  QUEUE_UPDATE: 'queue:update',
  QUEUE_VOTE: 'queue:vote',
  QUEUE_ADD: 'queue:add',

  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
} as const;

// Type-safe event payloads
export interface ServerToClientEvents {
  [SOCKET_EVENTS.QUEUE_UPDATE]: (queue: QueueTrack[]) => void;
  [SOCKET_EVENTS.PLAYBACK_STATE]: (state: PlaybackState) => void;
  [SOCKET_EVENTS.CHAT_MESSAGE]: (message: ChatMessage) => void;
  [SOCKET_EVENTS.PRESENCE_UPDATE]: (members: SessionMember[]) => void;
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.SESSION_JOIN]: (sessionId: string) => void;
  [SOCKET_EVENTS.SESSION_LEAVE]: (sessionId: string) => void;
  [SOCKET_EVENTS.QUEUE_VOTE]: (data: { sessionId: string; trackId: string }) => void;
  [SOCKET_EVENTS.CHAT_MESSAGE]: (data: { sessionId: string; content: string }) => void;
}
```

---

## 4. Backend: Service Pattern

```typescript
// services/api/src/services/queue.service.ts
export class QueueService {
  constructor(
    private redis: Redis,
    private db: DrizzleClient,
    private io: SocketIOServer,
  ) {}

  async addTrack(sessionId: string, trackData: AddTrackInput, userId: string): Promise<QueueTrack> {
    const queueKey = `session:${sessionId}:queue`;

    // Check queue limit
    const queueSize = await this.redis.zcard(queueKey);
    if (queueSize >= MAX_QUEUE_SIZE) {
      throw new AppError('QUEUE_FULL', 'Queue is full', 400);
    }

    // Check duplicate
    const exists = await this.redis.zscore(queueKey, trackData.spotifyId);
    if (exists !== null) {
      throw new AppError('TRACK_EXISTS', 'Track already in queue', 409);
    }

    // Add to Redis sorted set (score = 0 votes)
    await this.redis.zadd(queueKey, 0, trackData.spotifyId);

    // Store track metadata in hash
    await this.redis.hset(`track:${trackData.spotifyId}`, {
      ...trackData,
      addedBy: userId,
      addedAt: Date.now(),
    });

    // Persist to DB (write-behind)
    await this.db.insert(queueTracks).values({
      sessionId,
      spotifyId: trackData.spotifyId,
      addedBy: userId,
      metadata: trackData,
    });

    // Broadcast to session
    const updatedQueue = await this.getQueue(sessionId);
    this.io.to(`session:${sessionId}`).emit(SOCKET_EVENTS.QUEUE_UPDATE, updatedQueue);

    return updatedQueue.find((t) => t.spotifyId === trackData.spotifyId)!;
  }

  async vote(sessionId: string, trackId: string, userId: string): Promise<void> {
    const voteKey = `session:${sessionId}:votes:${trackId}`;
    const queueKey = `session:${sessionId}:queue`;

    // Check if already voted (idempotent)
    const alreadyVoted = await this.redis.sismember(voteKey, userId);
    if (alreadyVoted) {
      throw new AppError('ALREADY_VOTED', 'Already voted for this track', 409);
    }

    // Record vote + increment score atomically
    const pipeline = this.redis.pipeline();
    pipeline.sadd(voteKey, userId);
    pipeline.zincrby(queueKey, 1, trackId);
    await pipeline.exec();

    // Broadcast updated queue
    const updatedQueue = await this.getQueue(sessionId);
    this.io.to(`session:${sessionId}`).emit(SOCKET_EVENTS.QUEUE_UPDATE, updatedQueue);
  }

  async getQueue(sessionId: string): Promise<QueueTrack[]> {
    const queueKey = `session:${sessionId}:queue`;
    const items = await this.redis.zrevrangebyscore(queueKey, '+inf', '-inf', 'WITHSCORES');

    const tracks: QueueTrack[] = [];
    for (let i = 0; i < items.length; i += 2) {
      const spotifyId = items[i];
      const votes = parseInt(items[i + 1], 10);
      const metadata = await this.redis.hgetall(`track:${spotifyId}`);
      tracks.push({ spotifyId, votes, ...metadata } as QueueTrack);
    }

    return tracks;
  }
}
```

---

## 5. Error Handling

```typescript
// Unified error class
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Fastify error handler plugin
export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { details: error.details }),
      });
    }

    // Unexpected error
    request.log.error(error);
    Sentry.captureException(error);

    return reply.status(500).send({
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    });
  });
}
```

---

## 6. Music Provider Abstraction

```typescript
// Abstract away Spotify vs Apple Music
interface MusicProvider {
  search(query: string, limit?: number): Promise<Track[]>;
  getTrack(id: string): Promise<Track>;
  getRecommendations(seedTrackIds: string[]): Promise<Track[]>;
  play(trackId: string): Promise<void>;
  pause(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  getPlaybackState(): Promise<PlaybackState | null>;
}

class SpotifyProvider implements MusicProvider {
  constructor(private client: SpotifyWebApi, private accessToken: string) {
    this.client.setAccessToken(accessToken);
  }
  // ... implementations
}

class AppleMusicProvider implements MusicProvider {
  // ... implementations
}

// Factory
function createMusicProvider(user: User): MusicProvider {
  switch (user.musicService) {
    case 'spotify': return new SpotifyProvider(spotifyClient, user.spotifyToken);
    case 'apple': return new AppleMusicProvider(user.appleMusicToken);
    default: throw new AppError('NO_MUSIC_SERVICE', 'No music service linked', 400);
  }
}
```

---

## 7. Database Schema (Drizzle)

```typescript
// services/api/src/db/schema.ts
import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const sessionStatusEnum = pgEnum('session_status', ['active', 'paused', 'ended']);
export const memberRoleEnum = pgEnum('member_role', ['dj', 'member']);
export const musicServiceEnum = pgEnum('music_service', ['spotify', 'apple_music']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').unique().notNull(),
  displayName: text('display_name').notNull(),
  avatarUrl: text('avatar_url'),
  musicService: musicServiceEnum('music_service'),
  spotifyId: text('spotify_id'),
  spotifyRefreshToken: text('spotify_refresh_token'),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  coverUrl: text('cover_url'),
  djId: uuid('dj_id').references(() => users.id).notNull(),
  status: sessionStatusEnum('status').default('active').notNull(),
  inviteCode: text('invite_code').unique().notNull(),
  maxMembers: integer('max_members').default(50),
  isPublic: boolean('is_public').default(true),
  genre: text('genre'),
  currentTrackId: text('current_track_id'),
  currentTrackPosition: integer('current_track_position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
});

export const sessionMembers = pgTable('session_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: memberRoleEnum('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  leftAt: timestamp('left_at'),
});

export const queueTracks = pgTable('queue_tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  spotifyId: text('spotify_id').notNull(),
  addedBy: uuid('added_by').references(() => users.id).notNull(),
  metadata: jsonb('metadata').notNull(), // { name, artist, album, duration, coverUrl }
  votes: integer('votes').default(0),
  playedAt: timestamp('played_at'),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  queueTrackId: uuid('queue_track_id').references(() => queueTracks.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  type: text('type').default('text'), // text, track_share, system
  metadata: jsonb('metadata'), // For track shares: { trackId, trackName, ... }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  plan: text('plan').notNull(), // free, pro, dj
  revenuecatId: text('revenuecat_id'),
  stripeCustomerId: text('stripe_customer_id'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## 8. Convenciones de Código

### Reglas generales
- **No `any`** — usa `unknown` + type guard
- **No `as` casts** — excepto en tests
- **No side effects** en módulos — solo en entry points
- **Funciones puras** donde sea posible
- **Early returns** — no nesting profundo
- **Errores explícitos** — AppError con code, nunca throw genérico

### Naming
```typescript
// Functions: verb + noun
createSession(), getQueue(), sendNotification()

// Booleans: is/has/can prefix
isPlaying, hasVoted, canSkip

// Handlers: handle + Event
handleVote(), handleTrackEnd()

// Constants: UPPER_SNAKE
MAX_QUEUE_SIZE, VOTE_COOLDOWN_MS
```

### Component Pattern
```typescript
// Props interface siempre explícita
interface SessionCardProps {
  session: Session;
  onPress: (id: string) => void;
  variant?: 'compact' | 'full';
}

// Componente con memo si recibe callbacks
export const SessionCard = memo(function SessionCard({ 
  session, 
  onPress, 
  variant = 'full' 
}: SessionCardProps) {
  const handlePress = useCallback(() => {
    onPress(session.id);
  }, [session.id, onPress]);

  return (
    <Card onPress={handlePress}>
      {/* ... */}
    </Card>
  );
});
```
