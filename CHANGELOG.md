# WhatsSound — Changelog

## v2.0 — 3 Febrero 2026 (Sesión completa con Ángel)

### 🎵 Reproductor funcional
- **Audio real**: Preview de 30 segundos via Deezer API
- Botón play verde reproduce la canción que se muestra
- Proxy serverless en `/api/deezer` para evitar CORS
- HTML5 Audio (web), preparado para expo-av (native)

### 🗄️ Base de datos Supabase
- **17 tablas** con schema completo, RLS, triggers
- Seed data: 15 usuarios, 5 sesiones, 10 canciones, 12 mensajes, 6 propinas
- Realtime activado en 7 tablas (mensajes, votos, canciones, miembros, now playing, chat privado)
- Campo `is_seed` en todas las tablas para toggle visibilidad
- Migraciones versionadas: 001→004

### 📱 3 modos de acceso
- `?demo=true` → Modo inversor (read-only, datos mock)
- `?test=nombre` → Modo test (Supabase real, auto-crea usuario)
- Sin params → Producción (auth real, futuro)
- Presets: angel, quique, kike, leo, milo, adrian, maria, pablo, carlos, luna, sarah, paco

### 💬 Chat privado tipo WhatsApp
- Tabs reorganizadas: Chats → En Vivo → Grupos → Descubrir → Perfil
- Lista de chats con buscador, último mensaje, badges no leídos
- Chat individual con burbujas, realtime
- Contactos con búsqueda, invitar por link
- Sistema invitaciones con código único 8 chars

### 📊 Dashboard Admin completo
- Acceso protegido: `?admin=kike`, `?admin=angel`, `?admin=leo`
- 8 pestañas: Overview, Usuarios, Sesiones, Chat IA, Engagement, Revenue, Alertas, Config
- Métricas reales de Supabase
- Asistente IA "Leo" pluggable: Mock / Anthropic / OpenAI / Custom
- Gestión datos: toggle seed, borrar test, nuclear reset
- Health page con estado de servicios

### ✅ Tests (51 tests, 5 suites)
- `demo-basic` (6) — Estructura datos mock
- `supabase` (20) — Conexión, 12 tablas, seed data, seguridad RLS
- `deezer-proxy` (6) — Búsqueda, carátulas, preview, accesibilidad
- `modes` (13) — Modos demo/test/admin, rutas principales
- `admin-settings` (6) — Tabla settings, seed visibility, filtrado

### 🐛 Bugs resueltos
- WebSocket Realtime: trailing `\n` en API key → `.trim()`
- Imágenes Deezer CDN bloqueadas en China → iconos Ionicons
- Vercel 404 en SPA → rewrites en vercel.json
- Dashboard fuera del contenedor móvil 420px → position:fixed
- autoRefreshToken deshabilitado (hangs en China)

---

## v1.0 — Enero 2026

### Mockups iniciales
- 20 pantallas HTML completadas (de 50 planificadas)
- Design system completo (colores, tipografía, spacing)
- 4 variantes de logo
- App Expo con tabs funcionando
- Panel DJ, sesión usuario, ajustes
