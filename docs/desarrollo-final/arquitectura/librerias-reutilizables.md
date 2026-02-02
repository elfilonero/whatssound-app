# WhatsSound — Librerías Reutilizables

> Catálogo completo de dependencias con justificación. Todas probadas en producción por apps con millones de usuarios.

---

## Frontend Móvil (Expo / React Native)

### Core
| Librería | Versión | Para qué | Por qué esta |
|----------|---------|----------|-------------|
| `expo` | ~51 | Framework | OTA updates, managed workflow, EAS Build |
| `expo-router` | ~3 | Navegación | File-based routing, deep links, type-safe |
| `react-native` | 0.74+ | Runtime | Base de Expo |
| `typescript` | ~5.4 | Tipado | Non-negotiable para producción |

### UI & Diseño
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `tamagui` | UI Kit | Cross-platform (RN + Web), theming, performance. Compila a CSS en web. |
| `react-native-reanimated` | Animaciones | 60fps, runs on UI thread. Standard de la industria. |
| `react-native-gesture-handler` | Gestos | Swipe, drag, pinch. Requerido por reanimated. |
| `expo-linear-gradient` | Gradientes | Para UI musical (backgrounds de sesión) |
| `react-native-safe-area-context` | Safe areas | Notch, dynamic island, bottom bar |
| `expo-blur` | Blur effects | Modals, overlays estilo iOS |
| `react-native-svg` | SVG | Iconos, gráficos de votación |
| `@expo/vector-icons` | Iconos | MaterialIcons, Ionicons, FontAwesome incluidos |

**Debate Tamagui:**

**Dan:** "Tamagui compila estilos a CSS plano en web y a StyleSheet optimizado en nativo. Zero runtime overhead."

**Evan:** "¿No es NativeWind (Tailwind para RN) más simple?"

**Dan:** "NativeWind es bueno para prototipos. Tamagui te da un design system completo: tokens, themes, responsive, animations. Para producción necesitas eso."

**Pieter:** "Tamagui tiene curva de aprendizaje. ¿Vale la pena?"

**Dan:** "Sí. La alternativa es escribir un design system custom desde cero. Con Tamagui tienes: dark mode, responsive breakpoints, component variants, todo type-safe."

### Estado & Data Fetching
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `zustand` | Estado global | 1.1KB, no boilerplate, devtools, persist middleware |
| `@tanstack/react-query` | Server state | Cache, refetch, optimistic updates, offline. Estándar. |
| `zod` | Validación | Schema validation + TypeScript inference. Un solo schema para validar y tipar. |

**Debate estado:**

**Dan:** "Zustand para client state (UI, preferencias). React Query para server state (API data). Nunca mezclar ambos."

**Pieter:** "¿No es Redux Toolkit más estándar?"

**Dan:** "RTK tiene más boilerplate. Para una app de este tamaño, Zustand + React Query es más ergonómico. Si crece a 50 devs, reconsideramos."

### Audio & Música
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `react-native-track-player` | Reproductor de audio | Background playback, lock screen controls, notification player. Usado por apps de música en producción. |
| `expo-av` | Audio simple | Previews de 30s, sonidos de UI |
| `react-native-spotify-remote` | Spotify SDK bridge | Control de Spotify desde la app. Play, pause, queue. |

**Leo:** "react-native-track-player es CRÍTICO. Es lo que diferencia una app de música de un prototipo. Background playback, control desde lock screen, notification con artwork. Sin esto no somos una app de música."

### Chat & Comunicación
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `socket.io-client` | WebSocket client | Para sesiones realtime y sync de reproducción |
| `@supabase/supabase-js` | Supabase client | Auth, DB queries, realtime subscriptions, storage |
| `react-native-gifted-chat` | UI de chat | Bubbles, typing indicator, time stamps. Personalizable. Fork si es necesario. |

**Debate chat:**

**Pieter:** "Stream Chat SDK. $0 hasta 10k MAU. UI completa, threading, reactions, todo out of the box."

**Dan:** "Vendor lock-in brutal. $299/mes en el tier siguiente. Para una app de mensajería, el chat ES el core. No puedes depender de un tercero."

**Supabase Lead:** "Chat custom: mensajes en PostgreSQL con Supabase Realtime. gifted-chat para la UI. Controlas todo."

**✅ Decisión: Custom chat con gifted-chat UI + Supabase Realtime.** Si el volumen de mensajes explota, migramos a ScyllaDB para la tabla de mensajes.

### QR & Sharing
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `expo-barcode-scanner` | Escanear QR | Integrado con Expo, permisos manejados |
| `react-native-qrcode-svg` | Generar QR | SVG-based, customizable con logos |
| `expo-sharing` | Compartir | Share sheet nativo |
| `expo-clipboard` | Portapapeles | Copiar links de invitación |

### Navegación & Deep Links
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `expo-linking` | Deep links | Universal links, custom scheme |
| `expo-notifications` | Push & local | FCM integration, notification handlers |
| `expo-secure-store` | Almacenamiento seguro | Tokens, credentials (Keychain/Keystore) |

### Utilidades
| Librería | Para qué | Por qué esta |
|----------|----------|-------------|
| `date-fns` | Fechas | Tree-shakeable, immutable, no moment.js |
| `expo-image` | Imágenes optimizadas | Caching, blurhash, progressive loading. Reemplazo de Image. |
| `expo-haptics` | Feedback háptico | Vibración en votos, acciones |
| `react-native-mmkv` | Storage local rápido | 30x más rápido que AsyncStorage. Para cache offline. |

---

## Backend (Node.js + Fastify)

### Core
| Librería | Para qué | Por qué |
|----------|----------|---------|
| `fastify` | HTTP framework | 77k req/s, schema validation, plugin system |
| `@fastify/websocket` | WebSocket support | Integración nativa con Fastify |
| `socket.io` | Realtime engine | Rooms, namespaces, auto-reconnect, fallback polling |
| `@fastify/cors` | CORS | Seguridad cross-origin |
| `@fastify/rate-limit` | Rate limiting | Protección contra abuso |
| `@fastify/helmet` | Security headers | XSS, HSTS, etc. |

### Base de Datos & ORM
| Librería | Para qué | Por qué |
|----------|----------|---------|
| `@supabase/supabase-js` | Supabase client | PostgREST queries, auth verification, realtime |
| `drizzle-orm` | ORM para queries complejas | Type-safe, SQL-like, zero overhead. Para lógica de negocio compleja que PostgREST no cubre. |
| `drizzle-kit` | Migrations | Genera SQL migrations desde schema TypeScript |
| `ioredis` | Redis client | Para Upstash. Caching, pub/sub entre instancias Socket.io |

**Debate ORM:**

**Supabase Lead:** "Para el 80% de queries, usa PostgREST (supabase-js). Para queries complejas (agregaciones de votos, rankings), Drizzle."

**Dan:** "¿Prisma no es más popular?"

**Supabase Lead:** "Prisma genera un client gordo, cold starts lentos, y su query engine es un binary de Rust que no funciona en todos los runtimes. Drizzle es TypeScript puro, zero overhead, y genera SQL que puedes leer."

### Auth & Seguridad
| Librería | Para qué | Por qué |
|----------|----------|---------|
| `@supabase/auth-helpers-fastify` | Middleware auth | Verifica JWT de Supabase en Fastify |
| `jose` | JWT utilities | Verificación y decode de JWT. Ligero, standards-compliant. |
| `helmet` | HTTP security | Ya incluido via @fastify/helmet |
| `nanoid` | ID generation | IDs cortos para invite codes, session IDs |

### Integrations
| Librería | Para qué | Por qué |
|----------|----------|---------|
| `spotify-web-api-node` | Spotify API client | Wrapper completo, tipado, mantenido |
| `@apple/app-store-server-library` | Apple receipts | Verificación de compras |
| `stripe` | Stripe SDK | Pagos web, webhooks |
| `firebase-admin` | FCM push | Enviar push notifications |
| `twilio` | SMS OTP | Enviar códigos de verificación |

### Observabilidad
| Librería | Para qué | Por qué |
|----------|----------|---------|
| `@sentry/node` | Error tracking | Stack traces, breadcrumbs, performance |
| `posthog-node` | Analytics | Eventos, feature flags, A/B tests |
| `pino` | Logging | JSON structured logging, 5x faster que winston. Fastify lo usa nativo. |
| `pino-pretty` | Log formatting | Dev-only, pretty print |

### Validación & Utilidades
| Librería | Para qué | Por qué |
|----------|----------|---------|
| `zod` | Schema validation | Compartido con frontend. Un schema, una fuente de verdad. |
| `bullmq` | Job queues | Background jobs: enviar push, procesar pagos, limpiar sesiones. Redis-based. |
| `cron` | Scheduled jobs | Cron expressions para jobs periódicos |

---

## Monorepo & Tooling

| Librería | Para qué | Por qué |
|----------|----------|---------|
| `turborepo` | Monorepo build | Caching inteligente, parallel builds, task dependencies |
| `typescript` | Tipado | Compartir types entre packages |
| `eslint` + `@typescript-eslint` | Linting | Estándar, configurable |
| `prettier` | Formatting | Formato consistente, zero debates |
| `husky` + `lint-staged` | Git hooks | Lint/format pre-commit |
| `vitest` | Unit testing | Compatible con Jest API pero 10x más rápido. Soporte ESM nativo. |
| `@testing-library/react-native` | Component testing | Standard testing para RN |
| `maestro` | E2E mobile testing | YAML-based, más estable que Detox, video recording |
| `playwright` | E2E web testing | Standard de la industria |

---

## Cola de Música con Votación — Implementación

**Leo:** "Esto es el core de WhatsSound. La cola de música donde los usuarios votan y la canción más votada sube."

**Implementación: Priority Queue con Redis Sorted Set**

```typescript
// Estructura en Redis
// Key: session:{sessionId}:queue
// Score: voteCount (negativo para que ZRANGEBYSCORE dé el más votado primero)
// Value: trackId

// Agregar canción a cola
await redis.zadd(`session:${sessionId}:queue`, 0, trackId);

// Votar canción (incrementar score)
await redis.zincrby(`session:${sessionId}:queue`, 1, trackId);

// Obtener cola ordenada por votos
const queue = await redis.zrevrangebyscore(
  `session:${sessionId}:queue`, 
  '+inf', '-inf', 
  'WITHSCORES'
);

// Pop siguiente canción (más votada)
const next = await redis.zpopmax(`session:${sessionId}:queue`);
```

**¿Por qué Redis Sorted Set?**
- O(log N) para insert, vote, get-top
- Atómico (no race conditions en votos concurrentes)
- Efímero (la cola vive mientras dure la sesión)
- Persist to DB: snapshot cada 30s para recovery

**Librería:** No se necesita librería especial. `ioredis` + Redis Sorted Sets nativos.

---

## Resumen de Dependencies por Package

### `packages/app` (Expo)
~25 dependencias directas

### `packages/web` (Next.js)
~12 dependencias directas

### `packages/api` (Fastify)
~20 dependencias directas

### `packages/shared` (Types, utils, schemas)
~5 dependencias (zod, date-fns, nanoid)

**Total estimado:** ~60 dependencias directas. Lean para una app de esta complejidad.
