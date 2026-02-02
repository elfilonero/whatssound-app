# Decisión #002: Orden de desarrollo — Fase 1 MVP
**Fecha:** 2026-01-29
**Superexperto:** Mesa redonda completa (los 7)
**Estado:** ✅ Aprobada

## Contexto
Hay que decidir por dónde empezar a programar. Tenemos 50 pantallas y múltiples funcionalidades.

## Decisión — Orden de ataque

### Bloque 1: Fundación (primero)
1. **Setup proyecto** — Crear monorepo Expo, instalar dependencias, estructura de carpetas
2. **Design system base** — Colores, tipografía, componentes reutilizables (botones, inputs, cards)
3. **Navegación** — Tab bar + stack navigation (Expo Router)

### Bloque 2: Auth + Onboarding
4. **Splash screen** — Logo animado WhatsSound
5. **Onboarding** — 3 slides informativos
6. **Login** — Input teléfono + código de país
7. **OTP** — Verificación (simulada en local)
8. **Crear perfil** — Nombre, avatar, bio
9. **Permisos** — Notificaciones

### Bloque 3: Core — Sesiones
10. **Landing/Home** — Lista de sesiones activas
11. **Crear sesión (DJ)** — Formulario nombre, género, configuración
12. **Unirse a sesión** — Vista usuario dentro de sesión
13. **Chat en tiempo real** — Mensajes en la sesión
14. **Cola de canciones** — Lista con votación
15. **Pedir canción** — Búsqueda (mock) + solicitud

### Bloque 4: Funcionalidades DJ
16. **Panel DJ** — Controles, siguiente canción, anunciar
17. **Stats DJ** — Oyentes, canciones reproducidas
18. **Gestión cola** — Aprobar, rechazar, reordenar

### Bloque 5: Social
19. **Reacciones** — Emojis en tiempo real
20. **Propinas** — Enviar/recibir (simulado)
21. **Compartir QR** — Generar y escanear
22. **Perfiles** — Ver perfil usuario/DJ

### Bloque 6: Extras
23. **Ajustes** — Cuenta, notificaciones, privacidad
24. **Favoritos** — Canciones y sesiones guardadas
25. **Historial** — Sesiones pasadas
26. **Notificaciones** — Centro de notificaciones

## Justificación
- **Fundación primero:** Sin design system y navegación, no puedes construir nada
- **Auth segundo:** Es la puerta de entrada, todo depende de tener usuario
- **Core tercero:** Las sesiones son el corazón de la app
- **DJ cuarto:** Depende de que las sesiones funcionen
- **Social quinto:** Mejora la experiencia pero no es crítico para funcionar
- **Extras último:** Complementos que no bloquean nada

## Firmado por
**Mesa redonda completa** — Consenso unánime. El Experto Producto priorizó por valor de usuario. El Arquitecto Frontend por dependencias técnicas. Ambos criterios coinciden en este orden.
