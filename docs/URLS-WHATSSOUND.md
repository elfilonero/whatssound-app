# WhatsSound — Mapa de URLs

**Dominio:** https://whatssound-app.vercel.app

---

## 🔑 URLs de Administración

| URL | Descripción | Acceso |
|-----|-------------|--------|
| `/admin` | Dashboard principal con métricas | Kike, Ángel |
| `/admin/sessions` | Gestión de sesiones | Kike, Ángel |
| `/admin/users` | Gestión de usuarios | Kike, Ángel |
| `/admin/revenue` | Propinas e ingresos | Kike, Ángel |
| `/admin/engagement` | Métricas de engagement | Kike, Ángel |
| `/admin/config` | Configuración del sistema | Kike, Ángel |
| `/admin/health` | Estado de la base de datos | Kike, Ángel |
| `/admin/chat` | Chat con IA | Kike, Ángel |
| `/admin/alerts` | Alertas del sistema | Kike, Ángel |
| `/admin/simulator` | Simulador de datos | Kike, Ángel |

---

## 🎧 URLs de DJ Dashboard (por tier)

| URL | Descripción | Tier requerido |
|-----|-------------|----------------|
| `/dj-dashboard` | Dashboard básico | 🆓 Todos |
| `/dj-dashboard/creator` | Métricas avanzadas | ⭐ Creator+ |
| `/dj-dashboard/pro` | Analytics completo | 🎧 Pro+ |
| `/dj-dashboard/business` | IA + Multi-admin | 🏢 Business+ |

---

## 📨 URLs de Invitación

| URL | Descripción | Uso |
|-----|-------------|-----|
| `/invite` | Pantalla para generar/compartir código | Usuario logueado |
| `/join/CODIGO` | Landing cuando alguien recibe invitación | Nuevo usuario |
| `/invite-contact` | Invitar contacto específico | Usuario logueado |

**Ejemplo de invitación:**
```
https://whatssound-app.vercel.app/join/ABC123
```

---

## 📱 URLs Principales de la App

| URL | Descripción |
|-----|-------------|
| `/` | Redirige a `/live` |
| `/live` | Feed de sesiones en vivo |
| `/discover` | Descubrir DJs y sesiones |
| `/chats` | Conversaciones privadas |
| `/groups` | Grupos de música |
| `/settings` | Configuración de cuenta |
| `/hall-of-fame` | Salón de la fama |
| `/history` | Historial de sesiones |

---

## 🎵 URLs de Sesión

| URL | Descripción |
|-----|-------------|
| `/session/[id]` | Ver sesión en vivo |
| `/session/create` | Crear nueva sesión |
| `/session/dj-panel` | Panel del DJ |
| `/session/dj-queue` | Cola de canciones (DJ) |
| `/session/queue` | Cola de canciones (oyente) |
| `/session/request-song` | Pedir canción |
| `/session/reactions` | Reacciones |
| `/session/share-qr` | Compartir QR |

---

## 🔐 URLs de Autenticación

| URL | Descripción |
|-----|-------------|
| `/login` | Pantalla de login |
| `/otp` | Verificación OTP |
| `/create-profile` | Crear perfil |
| `/onboarding` | Onboarding inicial |
| `/genres` | Selección de géneros |

---

## 💳 URLs de Suscripción

| URL | Descripción |
|-----|-------------|
| `/subscription` | Comparativa de planes |
| `/tips` | Historial de propinas/dB |
| `/tips/payments` | Métodos de pago |

---

## 👤 URLs de Perfil

| URL | Descripción |
|-----|-------------|
| `/profile/[id]` | Ver perfil de usuario |
| `/profile/dj-public` | Perfil público de DJ |
| `/profile/followers` | Lista de seguidores |
| `/profile/golden-history` | Historial Golden Boost |
| `/edit-profile` | Editar mi perfil |

---

## 🔗 URLs para Compartir

### Para pruebas internas (equipo):
```
https://whatssound-app.vercel.app/admin
```

### Para invitar usuarios nuevos:
```
https://whatssound-app.vercel.app/join/[CODIGO]
```

### Para compartir sesión:
```
https://whatssound-app.vercel.app/session/[ID]
```

---

## ⚠️ Notas Técnicas

1. **Es una SPA (Single Page App):** Todas las rutas cargan el mismo `index.html` y el router de React/Expo maneja la navegación.

2. **Demo Mode:** Por defecto la app está en modo demo (`?demo=true`). Para modo real usar `?demo=false`.

3. **Vercel Rewrites:** Configurado en `vercel.json` para que todas las rutas vayan a `index.html`.

---

*Actualizado: 2026-02-04*
