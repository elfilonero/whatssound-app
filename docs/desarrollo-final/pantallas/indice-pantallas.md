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
| 2.1 | Landing — En Vivo | ✅ | `ws-landing.html` — Lista de sesiones activas, FAB crear/escanear |
| 2.2 | Landing — Grupos | ⬜ | Grupos de chat musical (futuro) |
| 2.3 | Landing — Llamadas | ⬜ | Historial de sesiones pasadas / llamadas |
| 2.4 | Escanear QR | ⬜ | Cámara + scanner overlay |
| 2.5 | Crear Nueva Sesión | ⬜ | Modal/pantalla: nombre, género, foto, config |
| 2.6 | Buscar Sesiones | ⬜ | Search con filtros (género, cercanía, popularidad) |

## 3. Sesión — Vista Usuario

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 3.1 | Sesión — Reproductor | ✅ | `ws-session-player.html` — Portada grande, reacciones, barra progreso |
| 3.2 | Sesión — Chat | ✅ | `ws-session-chat.html` — Burbujas, badges, menciones, waveform |
| 3.3 | Sesión — Cola (User) | ✅ | `ws-user-cola.html` — Ranking, medallas, votos, propinas, pedir canción |
| 3.4 | Sesión — Gente (User) | ✅ | `ws-user-gente.html` — Lista usuarios, roles, stats, invitar |
| 3.5 | Pedir Canción (modal) | ⬜ | Búsqueda en Spotify + preview + confirmar |
| 3.6 | Detalle de Canción | ⬜ | Info completa, quién la pidió, votos, abrir en Spotify |
| 3.7 | Perfil de Usuario (modal) | ⬜ | Avatar, nombre, stats, acciones (mensaje, VIP, silenciar) |
| 3.8 | Reacciones expandidas | ⬜ | Panel completo de reacciones con animaciones |

## 4. Sesión — Vista DJ

| # | Pantalla | Estado | Notas |
|---|----------|--------|-------|
| 4.1 | Panel DJ | ✅ | `ws-dj-panel.html` — Stats, acciones rápidas, preview chat |
| 4.2 | DJ — Cola | ✅ | `ws-dj-cola.html` — Drag reorder, aprobar/rechazar, AutoDJ, sorpresa |
| 4.3 | DJ — Gente | ✅ | `ws-dj-gente.html` — Moderación, dar VIP, silenciar, expulsar |
| 4.4 | DJ — Config | ✅ | `ws-dj-config.html` — Nombre, género, permisos, propinas, cerrar |
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

## Resumen

| Categoría | Hechas | Pendientes | Total |
|-----------|--------|------------|-------|
| Onboarding | 0 | 6 | 6 |
| Landing / Home | 1 | 5 | 6 |
| Sesión Usuario | 4 | 4 | 8 |
| Sesión DJ | 4 | 2 | 6 |
| Compartir | 1 | 1 | 2 |
| Ajustes | 10 | 2 | 12 |
| Propinas | 0 | 3 | 3 |
| Notificaciones | 0 | 2 | 2 |
| Extras | 0 | 5 | 5 |
| **TOTAL** | **20** | **30** | **50** |

> **20 pantallas completadas (40%)** — 30 pendientes para cobertura completa.
