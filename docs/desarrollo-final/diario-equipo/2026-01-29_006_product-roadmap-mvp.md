# 🗺️ Product Roadmap — WhatsSound MVP
**Fecha:** 2026-01-29  
**Autor:** Product Manager  
**Versión:** 1.0

---

## 📍 Visión de Producto

**WhatsSound = WhatsApp + Sesiones musicales en vivo.**  
Una app de mensajería donde cualquier grupo puede convertirse en una fiesta musical con DJ, cola de canciones con votos, propinas y chat en tiempo real.

**North Star Metric:** Canciones pedidas por sesión (engagement activo del usuario con la música).

---

## 🏗️ LO QUE YA TENEMOS vs LO QUE FALTA

### ✅ Ya construido (Bloque 1 — 19 pantallas UI)
| Área | Pantallas | Estado |
|------|-----------|--------|
| Auth | Splash, Onboarding, Login, OTP, Create Profile | UI completa, sin backend |
| Tabs | Chats, En Vivo, Descubrir, Ajustes | UI completa |
| Sesión | Chat sesión, Cola, Pedir canción, Crear sesión, Panel DJ, Propina, QR | UI completa |
| Social | Perfil DJ, Grupos, Chat grupal, Notificaciones | UI completa |
| Design System | Button, Input, Avatar, Card, Badge, Modal, Toast, EmptyState, BottomSheet | 9 componentes |
| Arquitectura | Modelo de datos PostgreSQL, API REST, WebSocket events, RLS | Documentado, sin implementar |

### ❌ Falta para MVP funcional
| Área | Qué falta | Esfuerzo |
|------|-----------|----------|
| **Backend** | Supabase setup: tablas, RLS, Edge Functions | 3-4 días |
| **Auth real** | OTP con Supabase Auth (Twilio) | 1 día |
| **Realtime** | Channels para sesión + chat + presence | 2-3 días |
| **Spotify** | OAuth DJ + búsqueda + playback proxy | 2-3 días |
| **Estado global** | Zustand stores + TanStack Query hooks | 2 días |
| **Navegación** | Rutas faltantes en Stack, deep links | 1 día |
| **Bug fixes** | 8 críticos + 9 moderados (ver QA #003) | 1-2 días |
| **Pagos** | Stripe Connect para propinas | 2-3 días (Fase 2) |

**Estimación total MVP funcional:** ~3 semanas desde hoy.

---

## 🎯 PRIORIZACIÓN MoSCoW

### 🔴 MUST HAVE (MVP — sin esto no lanzamos)
1. **Auth OTP funcional** — registro/login por teléfono
2. **Crear sesión musical** — DJ crea sesión con nombre y género
3. **Unirse a sesión** — usuario entra a sesión en vivo
4. **Cola de canciones con votos** — pedir canción + votar
5. **Chat en sesión** — mensajes en tiempo real dentro de la sesión
6. **Búsqueda de canciones** — Spotify simulado → real cuando DJ conecte
7. **Lista de sesiones en vivo** — tab "En Vivo" funcional
8. **Perfil básico** — nombre + avatar

### 🟡 SHOULD HAVE (semana 3-4, pre-launch)
9. **Chat 1:1 y grupos** — mensajería estilo WhatsApp
10. **Propinas** — enviar € al DJ (Stripe)
11. **Compartir sesión** — QR + deep link
12. **Notificaciones push** — nueva sesión, propina recibida
13. **Discover** — explorar DJs y eventos
14. **Perfil DJ público** — stats, géneros, historial

### 🟢 COULD HAVE (post-launch, tracción)
15. **Eventos programados** — sesión futura con "me interesa"
16. **Reacciones en vivo** — emojis floating en sesión
17. **Seguidores/siguiendo** — red social de DJs
18. **Historial de sesiones** — sesiones pasadas del usuario
19. **Tema oscuro/claro** — personalización visual
20. **Spotify playback real** — DJ controla música desde la app

### 🔵 WON'T HAVE (v1 — futuro)
- Chat de voz/audio messages
- Enviar imágenes/adjuntos en chat
- Multi-DJ (sesión con varios DJs)
- Monetización por suscripción
- Web app (solo mobile primero)
- Moderación automática de contenido
- Integración Apple Music / YouTube Music

---

## 👤 USER STORIES PRINCIPALES

### Usuario (Oyente)
| # | Story | Prioridad |
|---|-------|-----------|
| U1 | Como usuario, quiero registrarme con mi teléfono para entrar rápido sin email/contraseña | MUST |
| U2 | Como usuario, quiero ver sesiones en vivo cerca de mí para unirme a la que me guste | MUST |
| U3 | Como usuario, quiero pedir una canción al DJ para escuchar lo que quiero | MUST |
| U4 | Como usuario, quiero votar canciones en la cola para que suenen las que más gustan | MUST |
| U5 | Como usuario, quiero chatear durante la sesión para compartir el momento | MUST |
| U6 | Como usuario, quiero enviar propina al DJ para agradecerle la sesión | SHOULD |
| U7 | Como usuario, quiero compartir la sesión por QR/link para invitar amigos | SHOULD |
| U8 | Como usuario, quiero seguir a un DJ para saber cuándo pone música | COULD |

### DJ
| # | Story | Prioridad |
|---|-------|-----------|
| D1 | Como DJ, quiero crear una sesión en un click para empezar a pinchar | MUST |
| D2 | Como DJ, quiero ver la cola de peticiones ordenada por votos para saber qué poner | MUST |
| D3 | Como DJ, quiero aprobar/rechazar peticiones para mantener el estilo | MUST |
| D4 | Como DJ, quiero ver cuántos oyentes tengo en tiempo real para medir el engagement | MUST |
| D5 | Como DJ, quiero recibir propinas para monetizar mi sesión | SHOULD |
| D6 | Como DJ, quiero conectar mi Spotify para reproducir música real | SHOULD |
| D7 | Como DJ, quiero programar eventos futuros para que la gente se apunte | COULD |

### Grupo
| # | Story | Prioridad |
|---|-------|-----------|
| G1 | Como miembro de un grupo, quiero activar una sesión musical en el grupo para que todos participen | SHOULD |
| G2 | Como miembro, quiero chatear normal Y con música activa en el mismo grupo | SHOULD |

---

## 🛤️ FLUJOS DE USUARIO CRÍTICOS (Happy Path)

### Flujo 1: Nuevo usuario → Primera sesión (< 90 segundos)
```
Splash (2s) → Onboarding (skip o 3 slides) → Login (teléfono) → OTP (6 dígitos)
→ Crear perfil (nombre + avatar) → Tab "En Vivo" → Tap sesión → Dentro de sesión
→ Pedir canción → Votar → Chatear
```
**KPI:** % usuarios que piden su primera canción en < 5 min desde registro.

### Flujo 2: DJ crea sesión
```
Tab "En Vivo" → Botón "+" (crear sesión) → Nombre + Género + Config
→ Sesión activa → Comparte QR/link → Oyentes se unen
→ Ve cola de peticiones → Aprueba/rechaza → Pasa canción
→ Recibe propinas → Finaliza sesión → Ve stats
```
**KPI:** Duración media de sesión, nº oyentes pico.

### Flujo 3: Usuario se une por QR
```
Escanea QR / Abre deep link → App se abre en la sesión
→ (Si no registrado: auth rápido → vuelve a sesión)
→ Dentro de sesión → Pide canción → Vota
```
**KPI:** Conversión QR → dentro de sesión (target: >80%).

### Flujo 4: Chat de grupo con música
```
Tab "Chats" → Grupo → Chatear normal → DJ activa sesión
→ Banner "🎵 Sesión activa" aparece → Tap → Dentro de sesión
→ Puede chatear + pedir canciones + votar sin salir del grupo
```
**KPI:** % grupos que activan al menos una sesión/semana.

---

## 📊 MÉTRICAS DE ÉXITO (KPIs)

### North Star
| Métrica | Target MVP | Target 6 meses |
|---------|-----------|-----------------|
| **Canciones pedidas / sesión** | 5+ | 15+ |

### Activación
| Métrica | Target |
|---------|--------|
| Registro → primera sesión | < 90 segundos |
| Registro → primera canción pedida | < 5 minutos |
| Day 1 retention | > 40% |
| Day 7 retention | > 20% |

### Engagement
| Métrica | Target |
|---------|--------|
| Sesiones activas diarias (DAU sessions) | 10+ (beta) |
| Duración media de sesión | > 30 min |
| Mensajes de chat por sesión | > 20 |
| Votos por canción (media) | > 3 |

### DJ
| Métrica | Target |
|---------|--------|
| DJs activos semanales | 5+ (beta) |
| Sesiones por DJ / semana | > 2 |
| Oyentes pico por sesión | > 10 |

### Monetización (post-launch)
| Métrica | Target |
|---------|--------|
| % sesiones con al menos 1 propina | > 15% |
| Propina media | > €2 |
| Revenue mensual por DJ activo | > €50 |

---

## 🥊 COMPETENCIA Y DIFERENCIADORES

### Competencia directa
| Competidor | Qué hace | Debilidad |
|------------|----------|-----------|
| **JQBX** (cerrado 2023) | Listening rooms con Spotify | Requería Spotify Premium para TODOS. Cerró. |
| **Stationhead** | Radio social con Apple Music/Spotify | Solo escuchar juntos, sin cola/votos/peticiones |
| **Turntable.fm** (v2) | Avatares DJ en salas | Nicho retro, sin mobile-first, sin chat real |
| **Discord + bots música** | Servidores + Groovy/Rythm | Complejo, bots muertos por DMCA, no es mobile |
| **Spotify Group Session** | Escuchar juntos | Solo amigos cercanos, sin concepto DJ/audiencia |

### Nuestros diferenciadores
1. **WhatsApp-first** — la gente ya sabe usar la app, grupos naturales
2. **Cola democrática** — votos deciden qué suena, no solo el DJ
3. **Propinas** — monetización directa DJ↔fan (como Twitch pero para música)
4. **No requiere Spotify** — oyentes no necesitan cuenta, solo el DJ
5. **Mobile-native** — no es web metida en móvil, es app nativa
6. **Grupos → Sesiones** — transición natural: chateas → alguien pone música → fiesta

### Posicionamiento
> "WhatsSound es el WhatsApp de la música en vivo. Crea un grupo, activa la música, y deja que la gente vote qué suena."

---

## 🚀 PLAN DE LANZAMIENTO

### Fase Alpha (Semanas 1-3) — AHORA
**Objetivo:** App funcional end-to-end con datos simulados.
- Backend en Supabase (tablas + RLS + Edge Functions)
- Auth OTP real
- Sesiones + cola + votos + chat en tiempo real
- Spotify mock (datos fake pero flujo completo)
- Fix bugs críticos QA
- **Usuarios:** Solo equipo (3-5 personas)

### Fase Beta Cerrada (Semanas 4-5)
**Objetivo:** Validar con usuarios reales, encontrar PMF.
- Spotify real (DJ con Premium)
- Propinas simuladas (flujo sin Stripe real)
- Deep links + QR funcional
- TestFlight (iOS) + APK interno (Android)
- **Usuarios:** 20-30 invitados (amigos DJs + su audiencia)
- **Métricas:** Instalar PostHog, medir activación y retención

### Fase Soft Launch (Semanas 6-8)
**Objetivo:** Tracción orgánica, iterar sobre feedback.
- Stripe Connect para propinas reales
- Push notifications
- Discover (DJs, eventos)
- App Store (iOS) + Google Play
- **Usuarios:** 100-500 orgánicos
- **Métricas:** D1/D7 retention, canciones/sesión, propinas

### Fase Launch (Semana 9+)
**Objetivo:** Crecimiento.
- PR + redes sociales
- Programa de DJs embajadores
- Referral system (invita amigo → badge)
- Eventos patrocinados
- **Target:** 1,000 MAU primer mes

---

## 📋 SPRINT ACTUAL — Prioridades inmediatas

### Esta semana (Sprint 1 - Backend)
1. ☐ Setup Supabase proyecto + tablas SQL
2. ☐ Auth OTP funcional (login → profile → tabs)
3. ☐ CRUD sesiones (crear, listar live, unirse)
4. ☐ Realtime: chat en sesión + presence
5. ☐ Cola de canciones + votos

### Semana 2 (Sprint 2 - Integración)
1. ☐ Conectar pantallas UI → Supabase (stores + hooks)
2. ☐ Spotify OAuth para DJs + búsqueda real
3. ☐ Fix 8 bugs críticos QA
4. ☐ Navegación completa (rutas faltantes)
5. ☐ Grupos con sesión musical

### Semana 3 (Sprint 3 - Polish)
1. ☐ Propinas (Stripe Connect básico)
2. ☐ QR + deep links
3. ☐ Notificaciones push (Expo)
4. ☐ Discover tab funcional
5. ☐ TestFlight build → Beta cerrada

---

## 💡 DECISIÓN CLAVE: MVP MÍNIMO REAL

Si tuviéramos que lanzar en **1 semana**, esto es lo absolutamente mínimo:

1. Auth por teléfono ✓
2. Crear sesión (DJ) ✓
3. Ver sesiones en vivo ✓
4. Unirse a sesión ✓
5. Pedir canción (mock) ✓
6. Votar canción ✓
7. Chat en sesión ✓

**Sin esto:** No hay producto.  
**Todo lo demás:** Mejora la experiencia pero no define el producto.

El core es: **Gente votando canciones juntos en tiempo real.**

---

*Documento generado por Product Manager — WhatsSound Team*  
*29 de enero de 2026*
