# Estado MVP Backend — 29 Enero 2026 (10:55 CST)

## Resumen
**12 de 15 pantallas** conectadas a Supabase con datos reales.
**53 capturas** de evidencia.
**Realtime** implementado en chat y cola.
**Spotify API** preparada (código listo, falta Client ID).

## Pantallas conectadas al backend

| # | Pantalla | Store/API | Realtime | Estado |
|---|----------|-----------|----------|--------|
| 1 | Login | authStore → Supabase Auth | — | ✅ |
| 2 | Perfil (Ajustes) | authStore → profiles | — | ✅ |
| 3 | Editar perfil | authStore.updateProfile → profiles | — | ✅ |
| 4 | En Vivo | sessionStore.fetchLiveSessions → sessions | — | ✅ |
| 5 | Crear sesión | sessionStore.createSession → sessions | — | ✅ |
| 6 | Chat sesión | supabase.messages + Realtime | ✅ | ✅ |
| 7 | Cola canciones | sessionStore.fetchQueue + Realtime | ✅ | ✅ |
| 8 | Panel DJ | sessionStore + supabase stats | — | ✅ |
| 9 | Pedir canción | sessionStore.requestSong (+ Spotify ready) | — | ✅ |
| 10 | Enviar propina | supabase.tips | — | ✅ |
| 11 | Descubrir | supabase.profiles + followers | — | ✅ |
| 12 | Seguir DJ | supabase.followers (toggle) | — | ✅ |

## Pantallas pendientes (no críticas MVP)

| # | Pantalla | Motivo |
|---|----------|--------|
| 13 | Rating | UI only, presentacional |
| 14 | Share QR | Share nativo funciona, QR es visual |
| 15 | Stats post-sesión | Requiere agregación, presentacional |

## Spotify API (preparado)
- **Archivo:** `src/lib/spotify.ts`
- **Funciones:** `searchTracks()`, `getTrack()`, `isSpotifyConfigured()`
- **Integrado en:** `request-song.tsx` (usa Spotify si configurado, mock si no)
- **Pendiente:** Kike debe crear app en developer.spotify.com
- **Variables:** `EXPO_PUBLIC_SPOTIFY_CLIENT_ID`, `EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET`

## Supabase Realtime
- Chat: subscription a `messages` por session_id → mensajes en vivo
- Cola: subscription a `queue` por session_id → votos/nuevas canciones en vivo
- Deduplicación implementada (evita duplicados con optimistic updates)

## Tablas Supabase usadas
1. `profiles` — R/W (auth, editar perfil, DJs)
2. `sessions` — R/W (crear, listar, finalizar)
3. `queue` — R/W (pedir, votar, skip)
4. `messages` — R/W (chat, realtime)
5. `tips` — W (enviar propina)
6. `followers` — R/W (seguir/dejar DJ)
7. `votes` — W (votar canción)

## Próximos pasos
1. **Kike:** Crear app Spotify → Client ID (5 min)
2. Conectar búsqueda real con carátulas de Spotify
3. Preview 30s de canciones (gratis)
4. Deploy en Expo/Vercel para demo pública
