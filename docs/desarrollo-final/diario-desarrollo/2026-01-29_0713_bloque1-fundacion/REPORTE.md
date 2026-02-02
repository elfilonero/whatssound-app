# Bloque 1 — Fundación UI WhatsSound
**Fecha:** 2026-01-29 07:13 - 08:00 CST  
**Duración:** ~50 minutos  
**Pantallas completadas:** 19  
**Errores:** 0  

## Estructura de Tabs (aprobada por Ángel)
| Tab | Función |
|-----|---------|
| Chats | Mensajería WhatsApp (1a1 + grupos) |
| En Vivo | Sesiones de música activas ahora |
| Descubrir | Eventos futuros, DJs, géneros |
| Ajustes | Config de cuenta y app |

## Capturas (19)

### Auth Flow
1. `01-home` — Sesiones activas (versión inicial)
2. `02-onboarding` — 3 slides bienvenida
3. `03-login` — Teléfono con prefijo
4. `04-otp` — Verificación 6 dígitos
5. `05-crear-perfil` — Username + avatar

### Sesión Musical
6. `06-sesion-chat` — Chat en vivo durante sesión
7. `07-cola-canciones` — Lista con votos y reordenar
8. `08-pedir-cancion` — Búsqueda Spotify simulado
9. `09-crear-sesion` — DJ: nombre, género, config
10. `10-panel-dj` — Now playing, controles, stats, acciones
11. `11-enviar-propina` — €1/2/5/10 + custom + mensaje
12. `13-compartir-qr` — QR + link + redes sociales

### Perfiles
13. `14-perfil-dj` — Público: stats, en vivo, géneros, historial

### Tabs Principales (nueva estructura)
14. `12-ajustes` — Perfil, cuenta, app, soporte
15. `15-grupos` — Lista WhatsApp con indicador música
16. `16-chat-grupal` — Burbujas + banner sesión activa
17. `17-chats` — Tab principal: 1a1 + grupos mezclados
18. `18-en-vivo` — Sesiones activas, filtros, featured
19. `19-descubrir` — Búsqueda, géneros, eventos, top DJs

## Stack Técnico
- Expo Router (file-based routing)
- React Native Web para preview
- Theme: colors.ts / typography.ts / spacing.ts
- UI Kit: Button, Input, Card, Badge, Avatar
- 0 dependencias externas de UI

## Decisiones
- Tabs: Chats / En Vivo / Descubrir / Ajustes (aprobado por Ángel)
- WhatsApp es la base: grupos normales + capa de música encima
- Cada grupo puede activar/desactivar sesión musical
- Banner sutil en chat cuando hay música activa
