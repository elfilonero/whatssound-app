# 🔌 WhatsSound — APIs Externas

---

## Spotify Web API

### Uso en WhatsSound
- **Búsqueda de canciones** — `/v1/search?type=track`
- **Metadata** — Título, artista, álbum, portada, duración, preview URL
- **Control de reproducción** — Play, pause, skip, seek (requiere Spotify Premium del DJ)
- **Perfil** — Conectar cuenta, obtener playlists del usuario

### Autenticación
- **OAuth 2.0 PKCE** (mobile) — Authorization Code Flow
- **Scopes necesarios:**
  - `user-read-playback-state` — Estado de reproducción
  - `user-modify-playback-state` — Controlar reproducción
  - `user-read-currently-playing` — Canción actual
  - `streaming` — Streaming SDK
  - `user-library-read` — Biblioteca del usuario
  - `playlist-read-private` — Playlists

### Endpoints principales

| Endpoint | Método | Uso en WS |
|----------|--------|-----------|
| `/v1/search` | GET | Buscar canciones al pedir |
| `/v1/tracks/{id}` | GET | Metadata completa |
| `/v1/me/player/play` | PUT | Reproducir canción |
| `/v1/me/player/pause` | PUT | Pausar |
| `/v1/me/player/next` | POST | Siguiente canción |
| `/v1/me/player` | GET | Estado actual |
| `/v1/me` | GET | Perfil del usuario |

### Límites
- **Rate limit:** ~100 requests/minuto por usuario
- **Requiere Premium** para control de reproducción
- **30s preview** disponible gratis (para preview de canciones)

### SDK
- `react-native-spotify-remote` — Control nativo del player
- `spotify-web-api-node` — Backend API calls

---

## Apple Music API

### Uso en WhatsSound
- **Búsqueda y metadata** — Catálogo completo
- **Reproducción** — Via MusicKit (solo iOS nativo, requiere suscripción)
- **Personalización** — Recomendaciones basadas en historial

### Autenticación
- **Developer Token** (JWT firmado con clave privada de Apple)
- **Music User Token** — OAuth del usuario para acceso personal

### Endpoints principales

| Endpoint | Método | Uso en WS |
|----------|--------|-----------|
| `/v1/catalog/{store}/search` | GET | Buscar canciones |
| `/v1/catalog/{store}/songs/{id}` | GET | Metadata |
| `/v1/me/library/songs` | GET | Biblioteca del usuario |
| `/v1/me/recent/played` | GET | Historial |

### Límites
- **Rate limit:** ~200 requests/minuto
- **Solo iOS** para reproducción nativa (MusicKit)
- **Android:** Solo búsqueda y metadata, sin playback

### SDK
- `MusicKit JS` — Web playback
- `MusicKit` framework nativo — iOS

---

## YouTube Music (via YouTube Data API v3)

### Uso en WhatsSound
- **Búsqueda** — Videos musicales como fuente de canciones
- **Metadata** — Título, canal, thumbnail, duración

### Autenticación
- **API Key** para búsqueda pública
- **OAuth 2.0** para playlists/historial del usuario

### Endpoints principales

| Endpoint | Método | Uso en WS |
|----------|--------|-----------|
| `/youtube/v3/search` | GET | Buscar música (type=video, category=Music) |
| `/youtube/v3/videos` | GET | Metadata de video |
| `/youtube/v3/playlists` | GET | Playlists del usuario |

### Límites
- **Cuota:** 10,000 unidades/día (search = 100 unidades)
- **~100 búsquedas/día** con cuota base — solicitar aumento
- **Sin SDK de reproducción oficial** en mobile — usar iframe embed o solución third-party

### Consideraciones
- YouTube Music no tiene API pública oficial separada
- Se usa YouTube Data API filtrando por categoría música
- Reproducción compleja en mobile — considerar como servicio secundario

---

## Pasarela de Pagos — Stripe Connect

### Uso en WhatsSound
- **Propinas** — Usuario paga, DJ recibe (marketplace model)
- **Apple Pay / Google Pay** — Via Stripe SDK
- **Tarjetas** — Visa, Mastercard, etc.
- **Payouts** — Transferir balance del DJ a su cuenta bancaria

### Modelo: Stripe Connect (Standard/Express)

```
[Usuario] → paga €5 → [Stripe] → quita 10% (€0.50) → [DJ recibe €4.50]
                                 → comisión Stripe (~2.9% + €0.25) se deduce
```

### Flujo de integración

1. **DJ se registra** en Stripe Connect (onboarding embebido)
2. **Usuario agrega método de pago** (Stripe Elements / Payment Sheet)
3. **Crear PaymentIntent** al enviar propina
4. **Confirmar pago** con autenticación biométrica
5. **Transfer** automática a cuenta Connect del DJ (menos comisiones)
6. **Payout** — DJ solicita retiro → Stripe transfiere a su banco

### Endpoints principales

| Operación | Endpoint |
|-----------|----------|
| Crear cuenta Connect | `POST /v1/accounts` |
| Crear PaymentIntent | `POST /v1/payment_intents` |
| Crear Transfer | `POST /v1/transfers` |
| Crear Payout | `POST /v1/payouts` |
| Listar transacciones | `GET /v1/balance_transactions` |

### SDKs
- `@stripe/stripe-react-native` — Mobile SDK (Payment Sheet, Apple/Google Pay)
- `stripe` (Node.js) — Backend

### Comisiones

| Concepto | Porcentaje |
|----------|-----------|
| Comisión WhatsSound | 10% |
| Comisión Stripe (Europa) | 1.5% + €0.25 (tarjetas europeas) |
| Comisión Stripe (fuera Europa) | 2.9% + €0.25 |
| Apple Pay / Google Pay | Misma que tarjeta |

---

## Otras Integraciones

### Twilio / Vonage (SMS OTP)
- Verificación de teléfono en registro
- `POST /v2/Services/{ServiceSid}/Verifications` — enviar código
- `POST /v2/Services/{ServiceSid}/VerificationCheck` — verificar
- **Coste:** ~€0.05 por SMS

### Firebase Cloud Messaging (Push)
- Notificaciones push cross-platform
- Topics por sesión: `session_{id}`
- Token management en backend

### Cloudflare R2 (Storage)
- Avatares, portadas de sesión, notas de voz
- CDN integrado via Workers
- Compatible S3 API

### Branch.io (Deep Links)
- Universal links (iOS) + App Links (Android)
- Deferred deep linking (instala → abre en la sesión correcta)
- QR codes con tracking

---

## Resumen de Dependencias Externas

| Servicio | Criticidad | Fallback |
|----------|-----------|----------|
| **Spotify** | Alta (música) | Apple Music / YouTube Music |
| **Stripe** | Alta (pagos) | Desactivar propinas temporalmente |
| **Twilio** | Alta (auth) | Vonage como backup |
| **Firebase** | Media (push) | Notificaciones in-app |
| **Cloudflare** | Media (CDN) | S3 directo |
| **Branch** | Baja (links) | Links directos sin tracking |
