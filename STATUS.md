# WhatsSound — Estado del Proyecto

> Última actualización: 3 Febrero 2026

## 🟢 Versión actual: v2.0

**URL producción:** https://whatssound-app.vercel.app
**Repo:** github.com/elfilonero/whatssound-app (branch `main`)
**Deploy:** Vercel (auto con `vercel deploy --prod --yes`)

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React Native + Expo 54 + Expo Router |
| Web | Expo web export (static SPA) |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| State | Zustand (auth) + TanStack Query |
| Styling | StyleSheet RN + design system propio |
| Icons | @expo/vector-icons (Ionicons) |
| Audio | Deezer API (preview 30s) via proxy serverless |
| Deploy | Vercel |
| Tests | Jest (51 tests, 5 suites) |

---

## URLs de acceso

### Modo inversor (demo)
- Home: `/?demo=true`

### Modo test (datos reales Supabase)
- Ángel: `/?test=angel`
- Kike: `/?test=kike`
- Cualquier nombre: `/?test=nombre`

### Dashboard admin
- `/?admin=kike`
- `/?admin=angel`
- `/?admin=leo`

### Sesión directa
- `/session/b0000001-0000-0000-0000-000000000001?test=angel`

---

## ✅ Funcional (v2)

- [x] 5 tabs principales (Chats, En Vivo, Grupos, Descubrir, Perfil)
- [x] Sesión con 4 sub-tabs (Reproductor, Chat, Cola, Gente)
- [x] **Audio real** — Play reproduce preview Deezer 30s
- [x] Multi-usuario con `?user=` o `?test=`
- [x] Panel DJ completo
- [x] Chat privado tipo WhatsApp (lista, burbujas, contactos, invitaciones)
- [x] Dashboard Admin 8 pestañas con datos reales Supabase
- [x] Asistente IA "Leo" pluggable (Mock/Anthropic/OpenAI/Custom)
- [x] Gestión datos seed (toggle/borrar/nuclear)
- [x] 17 tablas Supabase con RLS, triggers, realtime
- [x] 51 tests automatizados pasando
- [x] Deploy continuo Vercel

## ⏳ Pendiente (v3+)

- [ ] Auth real con teléfono (Supabase OTP)
- [ ] Stripe para propinas reales
- [ ] Encriptación E2E chat privado
- [ ] Push notifications (Firebase FCM)
- [ ] Onboarding (splash, slides, registro)
- [ ] Búsqueda de sesiones con filtros
- [ ] Perfil DJ público
- [ ] Historial de sesiones pasadas
- [ ] Spotify connect (reproducción completa)

---

## Base de datos (17 tablas)

### Core
`ws_profiles`, `ws_sessions`, `ws_songs`, `ws_messages`, `ws_votes`, `ws_tips`, `ws_session_members`, `ws_now_playing`

### Chat privado
`ws_conversations`, `ws_conversation_members`, `ws_private_messages`, `ws_contacts`, `ws_invites`

### Admin
`ws_admin_settings`

### Migraciones
- `001_initial_schema.sql` — Schema base + seed
- `002_seed_data.sql` — Datos semilla
- `003_seed_visibility.sql` — Toggle visibilidad seed
- `004_private_chat.sql` — Chat privado

---

## Estructura de archivos clave

```
app/
├── _layout.tsx            # Root: AuthGate, QueryClient, appShell 420px
├── (tabs)/                # 5 tabs principales
│   ├── index.tsx          # Chats (privados)
│   ├── live.tsx           # En Vivo
│   ├── groups.tsx         # Grupos
│   ├── discover.tsx       # Descubrir
│   └── settings.tsx       # Perfil/Ajustes
├── session/
│   ├── [id].tsx           # Sesión (Reproductor/Chat/Cola/Gente)
│   ├── dj-panel.tsx       # Panel DJ
│   └── ...
├── admin/
│   ├── _layout.tsx        # Layout fullscreen con sidebar
│   ├── _sidebar.tsx       # Navegación admin
│   ├── index.tsx          # Overview KPIs
│   ├── users.tsx          # Gestión usuarios
│   ├── sessions.tsx       # Gestión sesiones
│   ├── chat.tsx           # Asistente IA Leo
│   ├── engagement.tsx     # Métricas engagement
│   ├── revenue.tsx        # Revenue y propinas
│   ├── alerts.tsx         # Alertas sistema
│   ├── config.tsx         # Configuración
│   └── health.tsx         # Estado servicios
└── api/
    └── deezer.ts          # Proxy Deezer (serverless)

src/
├── lib/supabase.ts        # Cliente Supabase
├── stores/authStore.ts    # Estado auth (Zustand)
├── theme/                 # Colores, tipografía, spacing
└── components/            # UI reutilizable

__tests__/                 # 51 tests Jest
supabase/migrations/       # SQL migraciones
```

---

## Equipo

- **Kike** (Enrique Alonso) — Fundador, dirección producto
- **Ángel Fernández** — Delegado España, supervisión desarrollo
- **Leo** — Desarrollo, IA, coordinación técnica

---

## Cómo continuar

1. `cd ~/clawd/projects/openparty/whatssound-app`
2. Editar código
3. `npx expo export --platform web` (build)
4. `npm test` (verificar tests)
5. `git add -A && git commit -m "msg" && git push origin main`
6. `vercel deploy --prod --yes` (deploy ~1min)

Variables de entorno en `.env` (local) y en Vercel dashboard.
Capturas de pantalla solo en `capturas/` (en .gitignore, solo Mac local).
