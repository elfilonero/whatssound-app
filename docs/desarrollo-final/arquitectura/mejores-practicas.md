# WhatsSound — Mejores Prácticas de Producción

---

## 1. Testing

### Estrategia: Pirámide de Testing

```
         ╱╲
        ╱ E2E ╲         5-10 tests (Maestro + Playwright)
       ╱────────╲
      ╱Integration╲     20-30 tests (API routes, DB queries)
     ╱──────────────╲
    ╱   Unit Tests    ╲  100+ tests (services, utils, hooks)
   ╱────────────────────╲
```

### Unit Tests (Vitest)
```typescript
// queue.service.test.ts
describe('QueueService', () => {
  let service: QueueService;
  let redis: MockRedis;

  beforeEach(() => {
    redis = new MockRedis();
    service = new QueueService(redis, mockDb, mockIo);
  });

  it('should add track to queue with 0 votes', async () => {
    await service.addTrack('session-1', mockTrack, 'user-1');
    const queue = await service.getQueue('session-1');
    expect(queue).toHaveLength(1);
    expect(queue[0].votes).toBe(0);
  });

  it('should reject duplicate tracks', async () => {
    await service.addTrack('session-1', mockTrack, 'user-1');
    await expect(service.addTrack('session-1', mockTrack, 'user-2'))
      .rejects.toThrow('TRACK_EXISTS');
  });

  it('should order queue by votes descending', async () => {
    await service.addTrack('session-1', track1, 'user-1');
    await service.addTrack('session-1', track2, 'user-1');
    await service.vote('session-1', track2.spotifyId, 'user-2');

    const queue = await service.getQueue('session-1');
    expect(queue[0].spotifyId).toBe(track2.spotifyId);
  });
});
```

### Integration Tests
```typescript
// Test real API routes with test DB
describe('POST /sessions/:id/queue', () => {
  it('should require authentication', async () => {
    const res = await app.inject({ method: 'POST', url: '/sessions/1/queue' });
    expect(res.statusCode).toBe(401);
  });

  it('should add track and broadcast to session', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/sessions/${testSession.id}/queue`,
      headers: { Authorization: `Bearer ${testToken}` },
      payload: { spotifyId: '4uLU6hMCjMI75M1A2tKUQC', name: 'Test Track' },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().spotifyId).toBe('4uLU6hMCjMI75M1A2tKUQC');
  });
});
```

### E2E Tests (Maestro para mobile)
```yaml
# e2e/flows/create-session.yaml
appId: com.whatssound.app
---
- launchApp
- tapOn: "Create Session"
- inputText:
    id: "session-name-input"
    text: "Friday Night Vibes"
- tapOn: "Select Genre"
- tapOn: "Electronic"
- tapOn: "Create"
- assertVisible: "Friday Night Vibes"
- assertVisible: "Share QR Code"
```

### Qué testear y qué no

| Testear | No testear |
|---------|-----------|
| Business logic (services) | Supabase/Fastify internals |
| API routes (request/response) | Third-party SDK behavior |
| State management (stores) | Estilos CSS/UI pixel-perfect |
| Validación (schemas) | Librerías externas |
| Flujos críticos E2E | Happy-path UI trivial |

---

## 2. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint
      - run: pnpm turbo typecheck
      - run: pnpm turbo test -- --coverage
      - uses: codecov/codecov-action@v4

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo build
```

```yaml
# .github/workflows/deploy-api.yml
name: Deploy API
on:
  push:
    branches: [main]
    paths: ['services/api/**', 'packages/shared/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: services/api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Deploy Flow
```
PR → CI (lint, typecheck, test) → Review → Merge to main
  ↓
main push → Deploy API (Fly.io) + Deploy Web (Vercel auto)
  ↓
EAS Build (manual trigger or tag) → TestFlight / Play Console
```

### Branch Strategy
- `main` — producción, siempre deployable
- `develop` — integración, preview deploys
- `feature/*` — ramas de feature
- `fix/*` — hotfixes
- Tags `v1.0.0` → trigger EAS Build

---

## 3. Monitoring & Observabilidad

### Stack: Sentry + PostHog + Pino + Uptime

#### Sentry (Error Tracking)
```typescript
// Mobile
import * as Sentry from '@sentry/react-native';
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2, // 20% de transacciones
  profilesSampleRate: 0.1,
  environment: __DEV__ ? 'development' : 'production',
});

// API
import * as Sentry from '@sentry/node';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.3,
  integrations: [
    new Sentry.Integrations.Postgres(),
    new Sentry.Integrations.Redis(),
  ],
});
```

#### PostHog (Product Analytics)
```typescript
// Eventos clave a trackear
posthog.capture('session_created', {
  genre: session.genre,
  isPublic: session.isPublic,
});

posthog.capture('track_added', {
  sessionId,
  source: 'search' | 'recommendation',
});

posthog.capture('vote_cast', {
  sessionId,
  queuePosition: track.position,
});

posthog.capture('session_joined', {
  method: 'qr' | 'link' | 'feed' | 'search',
});
```

#### Logging (Pino)
```typescript
// Structured JSON logs
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});

// Usage
logger.info({ sessionId, userId, trackId }, 'Track added to queue');
logger.warn({ sessionId, queueSize: 50 }, 'Queue approaching limit');
logger.error({ err, sessionId }, 'Failed to sync playback');
```

#### Uptime Monitoring
- **BetterUptime** (gratis) — ping `/health` cada 60s
- Alertas a Slack/Telegram cuando API down

### Alertas Configuradas
| Alerta | Trigger | Canal |
|--------|---------|-------|
| API down | Health check fail 2x | Telegram + SMS |
| Error spike | >50 errors/min | Sentry → Slack |
| Slow queries | p95 > 2s | Grafana → Slack |
| High memory | >80% | Fly.io → Slack |

---

## 4. Feature Flags (PostHog)

```typescript
// Check feature flag
const showAppleMusic = await posthog.isFeatureEnabled('apple-music', userId);

// In component
function MusicServicePicker() {
  const showApple = useFeatureFlag('apple-music');

  return (
    <View>
      <SpotifyButton />
      {showApple && <AppleMusicButton />}
    </View>
  );
}
```

**Flags planeados:**
- `apple-music` — Apple Music support (Fase 3)
- `premium-features` — Paywall (Fase 3)
- `dj-analytics` — DJ dashboard (Fase 3)
- `scheduled-sessions` — Sesiones programadas
- `new-onboarding` — A/B test de onboarding

---

## 5. Seguridad

### Authentication
- JWT con refresh tokens (1h access / 30d refresh)
- Supabase RLS en todas las tablas
- API routes verifican JWT en middleware

### Rate Limiting
```typescript
// Per-route rate limits
app.register(rateLimit, {
  global: true,
  max: 100,           // 100 req/min default
  timeWindow: '1 minute',
});

// Stricter for auth
app.register(rateLimit, {
  routePrefix: '/auth',
  max: 5,              // 5 OTP requests/min
  timeWindow: '1 minute',
});

// Stricter for votes (prevent spam)
app.register(rateLimit, {
  routePrefix: '/sessions/*/queue/*/vote',
  max: 30,             // 30 votes/min
  timeWindow: '1 minute',
});
```

### Input Validation
- Zod schemas en TODA ruta
- No raw `req.body` nunca
- SQL injection: imposible con Drizzle ORM + parametrized queries
- XSS: React escapa por defecto + helmet headers

### Secrets
- `.env` local (gitignored)
- Fly.io secrets para API
- Supabase Vault para secrets de DB
- Expo env con `EXPO_PUBLIC_` prefix para client-safe vars
- **NUNCA** secrets en código

### Data Protection
- Passwords: no aplica (OTP auth)
- Phone numbers: encrypted at rest (Supabase)
- Spotify tokens: encrypted en DB, refresh via server only
- Mensajes de chat: no E2E encryption (v1), plaintext en DB

---

## 6. Code Review Guidelines

### PR Requirements
1. **Descripción clara** de qué cambia y por qué
2. **Screenshots/video** para cambios de UI
3. **Tests** para nueva lógica de negocio
4. **No `console.log`** — usar logger
5. **No TODO sin issue** — crear GitHub issue
6. **Max 400 líneas** — PRs más grandes se splitean

### Checklist de Reviewer
- [ ] ¿Types correctos? (no `any`, no `as`)
- [ ] ¿Error handling? (qué pasa si falla?)
- [ ] ¿Validación de input?
- [ ] ¿Performance? (N+1 queries, re-renders innecesarios)
- [ ] ¿Security? (auth check, rate limit, RLS)
- [ ] ¿Tests?

### Commit Convention
```
feat(session): add voting system
fix(auth): handle expired OTP gracefully
refactor(queue): extract priority calculation
docs: update API documentation
chore: upgrade expo to 51.0.8
```

---

## 7. Disaster Recovery

| Escenario | Mitigación | RTO |
|-----------|-----------|-----|
| API crash | Fly.io auto-restart + health checks | <30s |
| DB down | Supabase managed, auto-failover | <5min |
| Redis down | Upstash managed, data recoverable from DB | <2min |
| Spike de tráfico | Fly.io auto-scale (2→8 machines) | <60s |
| Data corruption | Supabase PITR (point-in-time recovery) | <1h |
| Secret leaked | Rotate via Fly.io secrets + Supabase | <15min |

### Backups
- **DB:** Supabase daily backups + PITR (Pro plan)
- **Redis:** Ephemeral (queue state), rebuilds from DB
- **Code:** Git (GitHub)
- **Config:** Infrastructure as code (fly.toml, supabase config)
