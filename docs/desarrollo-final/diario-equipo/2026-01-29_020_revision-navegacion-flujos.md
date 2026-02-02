# Revisión de Navegación y Flujos — Sprint 020
**Fecha:** 2026-01-29  
**Dev:** Navegación (nav-polish)  
**Archivos tocados:** `app/session/[id].tsx`

---

## Checklist de Flujos

| # | Flujo | Estado | Notas |
|---|-------|--------|-------|
| 1 | Panel DJ → Chat | ✅ OK | Ya navegaba a `/session/${sessionId}` |
| 2 | Panel DJ → Cola | ✅ OK | Ya navegaba a `/session/queue` |
| 3 | Sesión → Pedir canción | 🔧 **CORREGIDO** | Botón "+" no tenía `onPress`. Ahora navega a `/session/request-song` |
| 4 | Sesión → Propina | 🔧 **CORREGIDO** | No existía botón. Añadido icono `cash-outline` → `/session/send-tip` |
| 5 | Sesión → Panel DJ | ✅ OK | Icono disco en header → `/session/dj-panel` |
| 6 | En Vivo → Sesión | ✅ OK | Usa `router.push(/session/${session.id})` con ID real de Supabase |
| 7 | Crear sesión → Sesión | ✅ OK | `router.replace(/session/${id})` tras crear en Supabase |
| 8 | Login → Home | ✅ OK | `router.replace('/(tabs)')` + AuthGate redirige automáticamente |

## Datos Reales en Header de Sesión

**Problema:** `[id].tsx` usaba `MOCK_SESSION` hardcodeado para nombre, DJ y oyentes en el header y mini player.

**Solución:** 
- Importado `useSessionStore` y llamado `fetchSession(id)` al montar
- Header ahora muestra `currentSession.name`, `dj_display_name`, `listener_count`
- Mini player muestra `current_song` y `current_artist` reales
- Fallback a mock si no hay datos (transición suave)

## Cambios Realizados en `[id].tsx`

1. **Import** `useSessionStore`
2. **useEffect** para `fetchSession(id)` al montar
3. **Variables derivadas** (`sessionName`, `djName`, `listenerCount`, `currentSong`, `currentArtist`) con fallback a mock
4. **Header** usa variables reales en vez de `MOCK_SESSION.*`
5. **Mini player** usa `currentSong` / `currentArtist` reales
6. **Botón "+"** ahora tiene `onPress={() => router.push('/session/request-song')}`
7. **Botón propina** añadido con icono `cash-outline` → `/session/send-tip`

## Pendientes

- Las pantallas `/session/request-song` y `/session/send-tip` deben existir (verificar con dev de features)
- El botón Panel DJ en header es visible para todos los usuarios; debería condicionarse a `currentSession.dj_id === user.id`
- `MOCK_SESSION` sigue definido como fallback — eliminar cuando Supabase sea estable al 100%
