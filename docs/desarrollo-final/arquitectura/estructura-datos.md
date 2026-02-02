# 📊 WhatsSound — Estructura de Datos

---

## Modelos Principales

### Usuario

```prisma
model User {
  id              String    @id @default(cuid())
  phone           String    @unique
  name            String    @db.VarChar(25)
  bio             String?   @db.VarChar(140)
  avatarUrl       String?
  isDJ            Boolean   @default(false)
  djName          String?   @db.VarChar(30)
  djBio           String?   @db.VarChar(200)
  djAvatarUrl     String?
  musicService    MusicService?
  musicServiceId  String?          // Spotify/Apple ID externo
  lastSeen        DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relaciones
  sessions        Session[]         // Sesiones creadas (como DJ)
  participations  SessionMember[]   // Sesiones donde participa
  songRequests    SongRequest[]
  votes           Vote[]
  tipsSent        Tip[]      @relation("TipSender")
  tipsReceived    Tip[]      @relation("TipReceiver")
  messages        Message[]
  paymentMethods  PaymentMethod[]
  blockedUsers    Block[]    @relation("Blocker")
  blockedBy       Block[]    @relation("Blocked")

  // Configuración
  settings        UserSettings?
}

enum MusicService {
  SPOTIFY
  APPLE_MUSIC
  YOUTUBE_MUSIC
}
```

### Sesión

```prisma
model Session {
  id              String        @id @default(cuid())
  code            String        @unique @db.VarChar(8)  // Para links: whatsound.app/s/ABC123
  name            String        @db.VarChar(40)
  description     String?       @db.VarChar(200)
  coverUrl        String?
  genres          String[]                              // ["reggaeton", "pop"]
  isPrivate       Boolean       @default(false)
  isActive        Boolean       @default(true)
  tipsEnabled     Boolean       @default(true)
  chatEnabled     Boolean       @default(true)
  autoApprove     Boolean       @default(true)
  maxSongsPerUser Int           @default(3)
  slowModeSeconds Int?                                  // null = desactivado
  startedAt       DateTime      @default(now())
  endedAt         DateTime?
  createdAt       DateTime      @default(now())

  // Relaciones
  dj              User          @relation(fields: [djId], references: [id])
  djId            String
  members         SessionMember[]
  songRequests    SongRequest[]
  messages        Message[]
  tips            Tip[]
  nowPlaying      NowPlaying?

  @@index([isActive, startedAt])
  @@index([code])
}

model SessionMember {
  id        String      @id @default(cuid())
  role      SessionRole @default(LISTENER)
  joinedAt  DateTime    @default(now())
  leftAt    DateTime?
  isMuted   Boolean     @default(false)
  mutedUntil DateTime?

  user      User        @relation(fields: [userId], references: [id])
  userId    String
  session   Session     @relation(fields: [sessionId], references: [id])
  sessionId String

  @@unique([userId, sessionId])
}

enum SessionRole {
  DJ
  MODERATOR
  VIP
  LISTENER
}
```

### Canción / Cola

```prisma
model SongRequest {
  id            String          @id @default(cuid())
  externalId    String                              // Spotify/Apple track ID
  title         String          @db.VarChar(200)
  artist        String          @db.VarChar(200)
  albumArt      String?
  durationMs    Int
  previewUrl    String?
  status        SongStatus      @default(PENDING)
  message       String?         @db.VarChar(200)
  hasTip        Boolean         @default(false)
  playedAt      DateTime?
  createdAt     DateTime        @default(now())

  // Relaciones
  session       Session         @relation(fields: [sessionId], references: [id])
  sessionId     String
  requestedBy   User            @relation(fields: [userId], references: [id])
  userId        String
  votes         Vote[]
  tip           Tip?

  @@index([sessionId, status])
  @@unique([sessionId, externalId])              // No duplicados en misma sesión
}

enum SongStatus {
  PENDING      // Esperando aprobación DJ
  QUEUED       // En cola, votable
  PLAYING      // Sonando ahora
  PLAYED       // Ya sonó
  REJECTED     // Rechazada por DJ
  SKIPPED      // Saltada
}

model NowPlaying {
  id          String    @id @default(cuid())
  progressMs  Int       @default(0)
  isPlaying   Boolean   @default(true)
  updatedAt   DateTime  @updatedAt

  session     Session   @relation(fields: [sessionId], references: [id])
  sessionId   String    @unique
  song        SongRequest @relation(fields: [songId], references: [id])
  songId      String
}
```

### Voto

```prisma
model Vote {
  id        String      @id @default(cuid())
  value     Int         @default(1)        // +1 (futuro: -1 para downvote)
  createdAt DateTime    @default(now())

  user      User        @relation(fields: [userId], references: [id])
  userId    String
  song      SongRequest @relation(fields: [songId], references: [id])
  songId    String

  @@unique([userId, songId])               // 1 voto por usuario por canción
}
```

### Propina

```prisma
model Tip {
  id            String      @id @default(cuid())
  amount        Decimal     @db.Decimal(10, 2)   // En EUR
  platformFee   Decimal     @db.Decimal(10, 2)   // 10% comisión
  netAmount     Decimal     @db.Decimal(10, 2)   // Lo que recibe el DJ
  currency      String      @default("EUR") @db.VarChar(3)
  message       String?     @db.VarChar(100)
  stripePaymentId String?
  status        TipStatus   @default(PENDING)
  createdAt     DateTime    @default(now())

  sender        User        @relation("TipSender", fields: [senderId], references: [id])
  senderId      String
  receiver      User        @relation("TipReceiver", fields: [receiverId], references: [id])
  receiverId    String
  session       Session     @relation(fields: [sessionId], references: [id])
  sessionId     String
  songRequest   SongRequest? @relation(fields: [songRequestId], references: [id])
  songRequestId String?     @unique

  @@index([receiverId, createdAt])
}

enum TipStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

### Mensaje

```prisma
model Message {
  id          String        @id @default(cuid())
  type        MessageType   @default(TEXT)
  content     String        @db.VarChar(500)
  audioUrl    String?                            // Para notas de voz
  audioDuration Int?                             // Duración en ms
  isPinned    Boolean       @default(false)
  isDeleted   Boolean       @default(false)
  createdAt   DateTime      @default(now())

  author      User          @relation(fields: [authorId], references: [id])
  authorId    String
  session     Session       @relation(fields: [sessionId], references: [id])
  sessionId   String
  reactions   Reaction[]
  mentions    Mention[]

  @@index([sessionId, createdAt])
}

enum MessageType {
  TEXT
  AUDIO
  SONG_SHARE     // Canción compartida
  SYSTEM         // Join/leave/now_playing
  DJ_ANNOUNCE    // Anuncio del DJ
  TIP_ANNOUNCE   // Propina enviada
  IMAGE
}

model Reaction {
  id        String   @id @default(cuid())
  emoji     String   @db.VarChar(10)   // 🔥 ❤️ 😂 👏 👍 😮
  userId    String
  messageId String
  message   Message  @relation(fields: [messageId], references: [id])

  @@unique([userId, messageId, emoji])
}

model Mention {
  messageId     String
  mentionedId   String
  message       Message @relation(fields: [messageId], references: [id])

  @@id([messageId, mentionedId])
}
```

---

## Diagrama de Relaciones

```
User ─────┬──── Session (como DJ)
          ├──── SessionMember (como participante)
          ├──── SongRequest (canciones pedidas)
          ├──── Vote (votos emitidos)
          ├──── Tip (enviadas/recibidas)
          └──── Message (mensajes)

Session ──┬──── SessionMember[]
          ├──── SongRequest[] ──── Vote[]
          ├──── Message[] ──── Reaction[]
          ├──── Tip[]
          └──── NowPlaying
```

---

## Datos en Redis (Cache/Real-time)

| Key | Tipo | Contenido | TTL |
|-----|------|-----------|-----|
| `session:{id}:members` | Set | userIds conectados ahora | — |
| `session:{id}:queue` | Sorted Set | songIds ordenados por votos | — |
| `session:{id}:typing` | Set | userIds escribiendo | 5s |
| `session:{id}:nowplaying` | Hash | songId, progressMs, isPlaying | — |
| `user:{id}:sessions` | Set | sessionIds activas | — |
| `ratelimit:{userId}:msg` | Counter | Mensajes enviados | 60s |
