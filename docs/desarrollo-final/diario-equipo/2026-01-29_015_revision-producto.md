# 📋 Revisión de Producto — WhatsSound MVP
**Fecha:** 2026-01-29  
**Rol:** Product Manager  
**Tipo:** Revisión técnica formal  
**Sesión:** #015

---

## 1. 📊 Cobertura Funcional — User Stories Cubiertas vs Pendientes

### ✅ Cubiertas en código (pantallas implementadas en Expo)
| # | User Story | Pantalla(s) |
|---|-----------|-------------|
| U1 | Registro por teléfono + OTP | `(auth)/login.tsx`, `otp.tsx`, `create-profile.tsx` |
| U2 | Ver sesiones en vivo | `(tabs)/live.tsx` |
| U3 | Pedir canción | `session/request-song.tsx` |
| U4 | Votar canciones en cola | `session/queue.tsx` |
| U5 | Chatear en sesión | `chat/[id].tsx` |
| U6 | Enviar propina al DJ | `session/send-tip.tsx` |
| U7 | Compartir sesión por QR | `session/share-qr.tsx` |
| D1 | Crear sesión como DJ | `session/create.tsx` |
| D2 | Ver cola ordenada por votos | `session/queue.tsx` (compartida) |
| D3 | Aprobar/rechazar peticiones | `session/dj-panel.tsx` |
| D4 | Ver oyentes en tiempo real | `session/stats.tsx`, `dj-panel.tsx` |
| — | Descubrir DJs y eventos | `(tabs)/discover.tsx` |
| — | Valorar sesión post-evento | `session/rate.tsx` |
| — | Stats post-sesión DJ | `session/stats.tsx` |
| — | Onboarding (splash + slides) | `(auth)/splash.tsx`, `onboarding.tsx` |
| — | Grupos + chat grupal | `group/create.tsx`, `group/[id].tsx`, `group/info.tsx` |
| — | Perfil de usuario | `profile/[id].tsx`, `profile/followers.tsx`, `edit-profile.tsx` |
| — | Settings completos | 10 pantallas en `settings/` |
| — | Notificaciones | `notifications.tsx` |
| — | Búsqueda global | `search.tsx` |
| — | Historial | `(tabs)/history.tsx` |
| — | Eventos | `event/[id].tsx` |

### ❌ User Stories SIN pantalla implementada
| # | Story | Impacto MVP | Notas |
|---|-------|-------------|-------|
| U8 | Seguir a un DJ | COULD | No hay follow/unfollow funcional, solo UI de followers |
| D5 | Recibir propinas (vista DJ: historial + retiro) | SHOULD | `send-tip.tsx` existe pero NO hay historial de propinas ni pantalla de retiro |
| D6 | Conectar Spotify real | SHOULD | Solo mock data en request-song |
| D7 | Programar eventos futuros | COULD | `event/[id].tsx` existe pero no crear evento |
| G1 | Activar sesión desde grupo | SHOULD | No hay transición grupo→sesión |
| — | Escanear QR para unirse | MUST | QR share existe, scanner para unirse NO |
| — | Deep link landing web | SHOULD | No existe |
| — | Error / Sin conexión | MUST | No hay pantalla offline |
| — | Force update | NICE | No existe |

### Veredicto
**Cobertura de pantallas: ~75% del MVP core.** Las pantallas más críticas (auth, sesión, cola, chat, propina, DJ panel) existen. Los huecos principales: scanner QR, historial propinas DJ, Spotify real, offline state.

---

## 2. 🔄 Flujos Críticos — Mapeo y Huecos

### Flujo 1: Registro → Primera Sesión
```
splash ✅ → onboarding ✅ → login (teléfono) ✅ → OTP ✅ → create-profile ✅
→ tabs/live ✅ → tap sesión → session/[id] ✅ → request-song ✅ → queue (votar) ✅
```
**Estado: ✅ COMPLETO en UI** (sin backend real)  
**Hueco:** Todo es mock data. Auth no valida OTP real. Sesiones son hardcoded.

### Flujo 2: DJ Crea Sesión → Recibe Propinas → Ve Stats
```
session/create ✅ → session/[id] (live) ✅ → dj-panel ✅ → queue (gestionar) ✅
→ recibe propina (notificación) ⚠️ → historial propinas ❌ → retirar fondos ❌
→ finalizar sesión → stats ✅ → rate (oyentes) ✅
```
**Estado: 🟡 70% COMPLETO**  
**Huecos:**
- ❌ No hay pantalla de historial de propinas del DJ
- ❌ No hay pantalla de retiro de fondos
- ⚠️ La notificación de propina recibida no está implementada
- ⚠️ Falta el flujo de "finalizar sesión" explícito

### Flujo 3: Unirse por QR
```
escanear QR ❌ → deep link ❌ → (auth si no registrado) → session/[id] ✅
```
**Estado: 🔴 INCOMPLETO** — Solo existe `share-qr.tsx` (generar QR), no el scanner ni deep link handler.

### Flujo 4: Propina Completa
```
session → botón propina → send-tip ✅ → seleccionar cantidad ✅ → mensaje ✅
→ confirmar pago ⚠️ → animación éxito ✅
```
**Estado: 🟡 80%** — UI completa, falta: biometrics/PIN real, integración Stripe, manejo de errores de pago.

### Flujo 5: Chat en Sesión
```
session/[id] → chat ✅ → enviar mensaje ✅ → ver burbujas ✅
```
**Estado: ✅ UI COMPLETO** — Sin WebSocket real.

---

## 3. 💰 Monetización — Análisis del Modelo de Propinas

### Lo que ESTÁ definido (doc flujos/propinas.md)
- ✅ Cantidades: €0.50 – €100
- ✅ Comisión plataforma: 10%
- ✅ Métodos de pago: Apple Pay, Google Pay, tarjeta, PayPal, Bizum
- ✅ Retiro: PayPal, transferencia, Bizum (min €10)
- ✅ Edge cases documentados (pago rechazado, menor de edad, sin método)
- ✅ Pasarela: Stripe Connect (documentado en stack)

### Lo que FALTA para cobrar comisión real
| Elemento | Estado | Esfuerzo |
|----------|--------|----------|
| **Stripe Connect setup** | No implementado | 2-3 días |
| **Onboarding DJ en Stripe** (KYC) | No existe pantalla | 1-2 días |
| **Pantalla retiro de fondos** | No existe | 1 día |
| **Historial de propinas (DJ)** | No existe | 1 día |
| **Verificación edad 18+** | No implementada | 0.5 día |
| **Términos legales propinas** | No redactados | Necesita abogado |
| **Facturación / impuestos** | No definido | Crítico para España/UE |
| **RevenueCat** para in-app purchases (iOS) | En stack pero no implementado | 2 días |

### 🚨 Riesgo Legal
Apple cobra 30% en in-app purchases. Si las propinas pasan por la App Store, la comisión real sería:
- Usuario paga €5 → Apple toma €1.50 → WhatsSound toma €0.35 (10% de €3.50) → DJ recibe €3.15
- **Alternativa:** Usar Stripe directo (fuera de IAP) como hace Patreon. Apple podría rechazar la app.
- **Recomendación:** Consultar las políticas actuales de Apple sobre "reader rule" y propinas digitales. Stripe Connect + reader rule puede funcionar.

---

## 4. 🥊 Competencia — WhatsSound vs Mercado

### Matriz Competitiva

| Feature | WhatsSound | JQBX (†2023) | Stationhead | Turntable.fm v2 | Discord+bots |
|---------|-----------|--------------|-------------|-----------------|-------------|
| Mobile-first | ✅ | ❌ Web | ✅ | ❌ Web | ✅ (no música) |
| Cola con votos | ✅ | ✅ | ❌ | ⚠️ Básico | ❌ |
| Chat en sesión | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Propinas al DJ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Sin Spotify obligatorio (oyente) | ✅ | ❌ | ❌ | ✅ | ❌ |
| Grupos → Música | ✅ | ❌ | ❌ | ❌ | ⚠️ |
| UX familiar (WhatsApp) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eventos programados | ✅ | ❌ | ✅ | ❌ | ✅ |

### Ventajas Competitivas Reales
1. **Monetización directa DJ↔fan** — nadie lo hace bien en música social
2. **No requiere Spotify al oyente** — baja la barrera de entrada masivamente
3. **WhatsApp mental model** — curva de aprendizaje ≈ 0
4. **Cola democrática** — el público decide, no solo el DJ

### Riesgos Competitivos
- **Spotify podría lanzar "Listening Party" nativa** con cola + votos
- **Instagram/TikTok Live** ya tiene propinas y audiencia masiva
- **DMCA / licencias musicales** — streaming de música a múltiples usuarios requiere licencias (Stationhead las tiene, nosotros no)

### 🚨 Riesgo Crítico: Licencias Musicales
Si el DJ reproduce música vía Spotify y la retransmite a oyentes sin Spotify Premium, estamos en zona gris legal. Stationhead resuelve esto requiriendo que CADA oyente tenga su propia cuenta. **Necesitamos definir el modelo legal antes de lanzar.**

---

## 5. 🚀 Go-to-Market — Qué Falta para Beta Privado

### Checklist Beta Privada (TestFlight)

#### Producto (Bloqueante)
- [ ] Auth OTP real (Supabase + Twilio)
- [ ] Backend funcional (Supabase: tablas + RLS)
- [ ] WebSocket real para chat + cola + presence
- [ ] Spotify OAuth para DJs (al menos búsqueda real)
- [ ] QR scanner para unirse
- [ ] Deep links funcionales
- [ ] Fix 8 bugs críticos del QA #003
- [ ] Pantalla offline / error states

#### Distribución (Bloqueante)
- [ ] Apple Developer Account ($99/año)
- [ ] TestFlight build funcional
- [ ] APK interno Android (EAS Build)
- [ ] Privacy Policy (obligatoria para TestFlight)
- [ ] Terms of Service

#### ASO / App Store Listing (Pre-launch)
- [ ] App Name: "WhatsSound — Música en Vivo"
- [ ] Subtitle: "Crea sesiones, vota canciones, chatea"
- [ ] Keywords: música en vivo, DJ, sesiones musicales, votar canciones, propinas DJ
- [ ] Screenshots (6 pantallas clave en mock device frames)
- [ ] App Icon (ya existe: `03-whatssound-appicon-movil.png`)
- [ ] App Preview video (30s demo)
- [ ] Descripción (corta + larga)
- [ ] Categoría: Music / Social Networking

#### Marketing (Nice-to-have para beta)
- [ ] Landing page (1 pager: hero + features + waitlist + download)
- [ ] Dominio: whatssound.app o whatssound.io
- [ ] Instagram @whatssound (crear, 5-10 posts pre-launch)
- [ ] TikTok con demo en evento real
- [ ] Lista de 20-30 DJs beta (reclutar personalmente)

---

## 6. 📈 Métricas y Analytics

### Stack Recomendado
- **PostHog** (ya en stack) — eventos, funnels, retention, feature flags
- **Sentry** (ya en stack) — crashes, errores
- **Supabase Analytics** — queries DB, realtime metrics

### Eventos Críticos a Trackear

#### Activación
| Evento | Propiedades |
|--------|------------|
| `app_opened` | source (organic, deeplink, qr, push) |
| `onboarding_started` | — |
| `onboarding_completed` | skipped: bool |
| `signup_started` | method (phone) |
| `otp_verified` | time_to_verify_ms |
| `profile_created` | has_avatar, has_spotify |
| `first_session_joined` | time_since_signup_ms, source |
| `first_song_requested` | time_since_signup_ms |

#### Sesión Musical
| Evento | Propiedades |
|--------|------------|
| `session_created` | genre, is_public, allow_requests |
| `session_joined` | source (browse, qr, deeplink, group), session_id |
| `session_left` | duration_ms, reason (manual, app_close, kicked) |
| `song_requested` | song_id, session_id, with_tip |
| `song_voted` | song_id, direction (up/down) |
| `song_played` | song_id, was_requested, had_tip, vote_count |
| `chat_message_sent` | session_id, has_mention |
| `reaction_sent` | type, session_id |

#### DJ
| Evento | Propiedades |
|--------|------------|
| `dj_session_started` | genre, config |
| `dj_song_approved` | song_id, queue_position |
| `dj_song_rejected` | song_id, reason |
| `dj_session_ended` | duration_ms, peak_listeners, total_songs, total_tips_eur |

#### Monetización
| Evento | Propiedades |
|--------|------------|
| `tip_initiated` | amount_eur, session_id |
| `tip_completed` | amount_eur, payment_method, has_message |
| `tip_failed` | amount_eur, error_code |
| `tip_withdrawal_requested` | amount_eur, method |

#### Retención
| Evento | Propiedades |
|--------|------------|
| `app_session_start` | days_since_signup, sessions_count |
| `qr_shared` | session_id |
| `friend_invited` | method (link, contacts, qr) |

### Funnels Clave
1. **Activación:** Install → Signup → Profile → First Session → First Song Request
2. **DJ Activación:** Signup → Create Session → First Listener → First Tip
3. **Monetización:** Session Join → View Tip Button → Open Tip Modal → Complete Tip
4. **Viralidad:** Session → Share QR → Friend Opens → Friend Joins

### Dashboards
1. **Daily Health:** DAU, sesiones activas, canciones/sesión, crashes
2. **Activation Funnel:** Conversion rates por step
3. **DJ Health:** DJs activos, duración media, propinas/sesión
4. **Revenue:** Tips totales, comisión, ARPU

---

## 7. 🗺️ Roadmap MVP — Próximas 5 Sesiones de Desarrollo

### Sesión 12 (Siguiente) — BACKEND CORE 🔴
**Objetivo:** App conectada a datos reales, auth funcional
- [ ] Supabase: crear tablas (users, sessions, songs, votes, messages, tips)
- [ ] Row Level Security policies
- [ ] Auth OTP con Twilio
- [ ] Zustand stores + TanStack Query hooks para sessions y songs
- [ ] Conectar pantallas auth (login → OTP → profile → tabs)

### Sesión 13 — REALTIME + SESIONES EN VIVO 🔴
**Objetivo:** Sesiones musicales funcionales end-to-end
- [ ] Supabase Realtime channels para chat + cola + presence
- [ ] Crear sesión → aparece en live tab → otros se unen
- [ ] Cola de canciones con votos en tiempo real
- [ ] Presence: "47 oyentes" actualizado live
- [ ] QR scanner para unirse a sesión

### Sesión 14 — SPOTIFY + PROPINAS 🟡
**Objetivo:** Música real + monetización básica
- [ ] Spotify OAuth para DJs
- [ ] Búsqueda real de canciones (Spotify Web API)
- [ ] Stripe Connect setup + onboarding DJ
- [ ] Enviar propina (flujo completo con pago real)
- [ ] Historial de propinas (DJ)

### Sesión 15 — POLISH + QA 🟡
**Objetivo:** Calidad beta-ready
- [ ] Fix bugs críticos del QA (#003 + nuevos)
- [ ] Deep links funcionales (Expo Linking)
- [ ] Push notifications (FCM via Expo)
- [ ] Pantalla offline / error states
- [ ] Pantalla retiro de fondos DJ
- [ ] PostHog: instrumentar eventos de activación

### Sesión 16 — BETA LAUNCH 🟢
**Objetivo:** TestFlight + primeros usuarios reales
- [ ] EAS Build → TestFlight (iOS)
- [ ] APK interno (Android)
- [ ] Privacy Policy + Terms of Service
- [ ] Landing page básica (whatssound.app)
- [ ] Reclutar 10 DJs beta
- [ ] Onboarding guiado para primeros usuarios
- [ ] Dashboard PostHog con funnels clave

---

## 🚨 Riesgos Principales

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| **Licencias musicales** (streaming a non-Spotify users) | Alta | Bloqueante | Consultar abogado IP; opción: requerir Spotify a todos |
| **Apple rechaza propinas** (30% rule) | Media | Alto | Usar Stripe Connect + reader rule; consultar Apple guidelines |
| **Spotify API rate limits** | Media | Medio | Cache agresivo, fallback a mock |
| **Baja retención** (novedad → abandono) | Alta | Alto | Notificaciones, programa DJ embajadores, eventos recurrentes |
| **Complejidad backend** realtime a escala | Media | Medio | Supabase Realtime maneja ~500 concurrent; suficiente para beta |

---

## 📌 Decisiones Pendientes (Necesitan Respuesta)

1. **¿Requiere Spotify Premium para oyentes?** — Define modelo legal y barrera de entrada
2. **¿Propinas vía IAP (Apple) o Stripe directo?** — Define margen y riesgo de rechazo
3. **¿Lanzar primero iOS o ambos?** — TestFlight es más rápido; Android beta vía APK
4. **¿Verificación de edad real para propinas?** — Regulación de pagos en España/UE
5. **¿Mercado inicial?** — Recomendación: España primero (Bizum, regulación conocida, proximidad)

---

*Revisión generada por Product Manager — WhatsSound Team*  
*29 de enero de 2026 — Sesión #015*
