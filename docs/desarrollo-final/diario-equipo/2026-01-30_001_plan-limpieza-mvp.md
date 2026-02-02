# 📋 Plan de Limpieza MVP — 30 Enero 2026 (05:16 CST)

**Aprobado por:** Ángel Fernández
**Ejecutor:** Equipo de 5 agentes en paralelo

## Agentes Desplegados

| # | Agente | Tarea | Archivos |
|---|--------|-------|----------|
| 1 | `cleanup-mock` | Eliminar mock data + IDs hardcodeados | 8 archivos |
| 2 | `fix-typescript` | Corregir 21 errores TypeScript | ~7 archivos |
| 3 | `refactor-session` | Partir session/[id].tsx (1064→<300 líneas) | 1→6 archivos |
| 4 | `fix-rls` | RLS seguridad con SECURITY DEFINER | SQL en Supabase |
| 5 | `connect-screens` | Conectar 6 pantallas pendientes | 6 archivos |

## Métricas Pre-Limpieza

- **Líneas de código:** 12,035
- **Archivos:** 70
- **Errores TypeScript:** 21
- **Archivos con mock data:** 7
- **IDs hardcodeados:** 2 archivos
- **Tablas sin RLS:** 3 (chats, chat_members, chat_messages)
- **Pantallas sin backend:** 6

## Objetivo Post-Limpieza

- 0 errores TypeScript
- 0 datos mock
- 0 IDs hardcodeados
- 10/10 tablas con RLS activo
- session/[id].tsx < 300 líneas
- 15/15 pantallas conectadas a Supabase
- Build limpio + deploy + test E2E con video
