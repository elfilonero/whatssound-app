# 📱 WhatsSound — Índice Completo de Pantallas

> Estado: ✅ Mockup hecho | ⬜ Pendiente

---

## 1. Onboarding y Autenticación

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 1.1 | Splash Screen | ⬜ | Logo animado + "El WhatsApp de la música" |
| 1.2 | Onboarding (3 slides) | ⬜ | Crea sesiones / Vota canciones / Chatea en vivo |
| 1.3 | Login / Registro | ⬜ | Teléfono + OTP (estilo WhatsApp) |
| 1.4 | Verificación OTP | ⬜ | Input 6 dígitos |
| 1.5 | Crear Perfil | ⬜ | Nombre + foto + conectar Spotify |
| 1.6 | Permisos | ⬜ | Notificaciones, contactos |

## 2. Landing / Home

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 2.1 | Landing — En Vivo | ✅ | `app/(tabs)/live.tsx` — Sesiones activas, conectado a Supabase |
| 2.2 | Landing — Chats | ✅ | `app/(tabs)/index.tsx` — Chat privado tipo WhatsApp (v2) |
| 2.3 | Landing — Grupos | ✅ | `app/(tabs)/groups.tsx` — Grupos musicales |
| 2.4 | Escanear QR | ⬜ | Cámara + scanner overlay |
| 2.5 | Crear Nueva Sesión | ✅ | `app/session/create.tsx` — Crear sesión |
| 2.6 | Descubrir | ✅ | `app/(tabs)/discover.tsx` — Sesiones populares, DJs, géneros |

## 3. Sesión — Vista Usuario

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 3.1 | Sesión — Reproductor | ✅ | `app/session/[id].tsx` — **Audio funcional** (Deezer 30s), reacciones, progreso |
| 3.2 | Sesión — Chat | ✅ | `app/session/[id].tsx` — Burbujas WhatsApp, badges DJ/VIP/MOD, realtime |
| 3.3 | Sesión — Cola (User) | ✅ | `app/session/[id].tsx` — Ranking, medallas 🥇🥈🥉, votos, pedir canción |
| 3.4 | Sesión — Gente (User) | ✅ | `app/session/[id].tsx` — Lista usuarios, roles, online/offline |
| 3.5 | Pedir Canción (modal) | ⬜ | Búsqueda en Spotify + preview + confirmar |
| 3.6 | Detalle de Canción | ⬜ | Info completa, quién la pidió, votos, abrir en Spotify |
| 3.7 | Perfil de Usuario (modal) | ⬜ | Avatar, nombre, stats, acciones (mensaje, VIP, silenciar) |
| 3.8 | Reacciones expandidas | ⬜ | Panel completo de reacciones con animaciones |

## 4. Sesión — Vista DJ

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 4.1 | Panel DJ | ✅ | `app/session/dj-panel.tsx` — Stats, controles, chat preview, IA |
| 4.2 | DJ — Cola | ✅ | `app/session/dj-queue.tsx` — Aprobar/rechazar, reorder |
| 4.3 | DJ — Gente | ✅ | `app/session/dj-people.tsx` — Moderación, VIP, silenciar |
| 4.4 | DJ — Config | ✅ | Incluido en dj-panel — Nombre, género, permisos |
| 4.5 | DJ — Anunciar (modal) | ⬜ | Enviar mensaje destacado a todos |
| 4.6 | DJ — Stats detalladas | ⬜ | Gráficas: oyentes/tiempo, canciones más votadas, propinas |

## 5. Compartir / QR

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 5.1 | Compartir QR | ✅ | `ws-share-qr.html` — Tarjeta visual, QR, share buttons |
| 5.2 | Deep Link Landing | ⬜ | Web: "Abre en WhatsSound" + fallback install |

## 6. Ajustes

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 6.1 | Ajustes Principal | ✅ | `ws-ajustes.html` — Perfil DJ, stats, Spotify, lista ajustes |
| 6.2 | Cuenta | ✅ | `ws-cuenta.html` — Privacidad, seguridad, verificación, pagos |
| 6.3 | Privacidad | ✅ | `ws-privacidad.html` — Última conexión, foto, historial, bloqueos |
| 6.4 | Chats (ajustes) | ✅ | `ws-chats-ajustes.html` — Tema, fondo, tamaño letra, backup |
| 6.5 | Notificaciones | ✅ | `ws-notificaciones.html` — Tonos, alertas musicales, sesiones |
| 6.6 | Servicios de Música | ✅ | `ws-servicios-musica.html` — Spotify, Apple Music, YouTube Music |
| 6.7 | Almacenamiento | ✅ | `ws-almacenamiento.html` — Uso, cache, calidad, gestionar |
| 6.8 | Idioma | ✅ | `ws-idioma.html` — Selector con banderas |
| 6.9 | Ayuda | ✅ | `ws-ayuda.html` — Centro ayuda, FAQ, soporte, términos |
| 6.10 | Invitar Amigos | ✅ | `ws-invitar.html` — Link, share, contactos |
| 6.11 | Editar Perfil | ⬜ | Cambiar foto, nombre, bio, perfil DJ |
| 6.12 | Perfil DJ público | ⬜ | Cómo te ven otros: sesiones, rating, historial |

## 7. Propinas y Pagos

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 7.1 | Enviar Propina (modal) | ⬜ | Seleccionar cantidad + mensaje + confirmar |
| 7.2 | Historial de Propinas | ⬜ | Recibidas/enviadas, totales |
| 7.3 | Configurar Pagos | ⬜ | Métodos de pago, retirar fondos |

## 8. Notificaciones y Actividad

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 8.1 | Centro de Notificaciones | ⬜ | Lista de notifs: sesiones, votos, propinas, menciones |
| 8.2 | Invitación a Sesión | ⬜ | Push/in-app: "DJ Nombre te invita" + preview |

## 9. Extras

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 9.1 | Historial de Sesiones | ⬜ | Sesiones pasadas con stats |
| 9.2 | Favoritos / Guardados | ⬜ | Canciones votadas, sesiones guardadas |
| 9.3 | Audio en Directo | ⬜ | Interfaz walkie-talkie (DJ habla a la sesión) |
| 9.4 | Error / Sin Conexión | ⬜ | Estado offline, reintentar |
| 9.5 | Actualización Requerida | ⬜ | Force update screen |

---

## Resumen (actualizado v2 — 3 Feb 2026)

| Categoría | Hechas | Pendientes | Total |
|-----------|--------|------------|-------|
| Onboarding | 0 | 6 | 6 |
| Landing / Home | 5 | 1 | 6 |
| Sesión Usuario | 4 | 4 | 8 |
| Sesión DJ | 4 | 2 | 6 |
| Compartir | 1 | 1 | 2 |
| Ajustes | 10 | 2 | 12 |
| Propinas | 0 | 3 | 3 |
| Notificaciones | 0 | 2 | 2 |
| Extras | 0 | 5 | 5 |
| **Dashboard Admin** | **10** | **0** | **10** |
| **TOTAL** | **34** | **26** | **60** |

> **34 pantallas completadas (57%)** — incluye 10 pantallas admin nuevas (v2).
> Dashboard admin: Overview, Usuarios, Sesiones, Chat IA, Engagement, Revenue, Alertas, Config, Health, Sidebar.
> Audio funcional: reproductor suena con Deezer preview 30s. ✅
