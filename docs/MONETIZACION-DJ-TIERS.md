# WhatsSound — Plan de Monetización: Tiers para DJs

**Fecha:** 2026-02-04  
**Estado:** Aprobado  
**Versión:** 1.0

---

## Resumen Ejecutivo

Sistema de suscripción de 4 tiers para DJs y organizadores de eventos, diseñado para monetizar la plataforma manteniendo un tier gratuito atractivo que impulse el crecimiento orgánico.

---

## Estructura de Tiers

### 🆓 GRATIS — "DJ Social"
**Precio:** €0/mes  
**Target:** Cualquier persona que quiere poner música con amigos

| Función | Límite |
|---------|--------|
| Crear sesiones | ✅ Ilimitadas |
| Oyentes simultáneos | 20 máx |
| Cola de canciones | ✅ Con votos |
| Chat en tiempo real | ✅ |
| Ver quién escucha | ✅ |
| Recibir decibelios | ✅ |
| Métricas básicas | Oyentes totales, canciones |
| Historial | 7 días |

---

### ⭐ CREATOR — €1,99/mes
**Target:** Organizadores frecuentes, pequeño público fiel

| Función | Incluido |
|---------|----------|
| Todo lo GRATIS | ✅ |
| Oyentes simultáneos | 100 máx |
| Notificaciones push a seguidores | ✅ |
| Historial de sesiones | 30 días |
| Estadísticas engagement | Canciones top, picos |
| Programar sesiones | ✅ |
| Badge Creator verificado | ✅ |
| Modo "Anunciar evento" | ✅ |

---

### 🎧 PRO — €7,99/mes
**Target:** DJs semi-profesionales, promoción activa

| Función | Incluido |
|---------|----------|
| Todo lo CREATOR | ✅ |
| Oyentes simultáneos | ♾️ Ilimitados |
| Dashboard analytics completo | ✅ |
| Exportar estadísticas (CSV/PDF) | ✅ |
| Perfil profesional + portfolio | ✅ |
| Prioridad en Descubrir | ✅ |
| Enlace reservas/contacto | ✅ |
| Widget embed para web | ✅ |
| Co-DJs (invitar a sesión) | ✅ |
| Soporte prioritario | ✅ |

---

### 🏢 BUSINESS — €29,99/mes
**Target:** Locales, promotoras, artistas establecidos

| Función | Incluido |
|---------|----------|
| Todo lo PRO | ✅ |
| Multi-sesión (varias salas) | ✅ |
| Branding personalizado | Logo + colores |
| API de integración | ✅ |
| Asistente IA análisis audiencia | ✅ |
| Dashboards tiempo real eventos | ✅ |
| Métricas predictivas | Mejor hora, público |
| Moderación automática chat | ✅ |
| Equipo multi-admin | ✅ |
| Facturación + reportes fiscales | ✅ |
| Onboarding personalizado | ✅ |

---

### 🏆 ENTERPRISE — Precio custom
**Target:** Festivales, grandes salas, sellos discográficos

| Función | Incluido |
|---------|----------|
| Todo lo BUSINESS | ✅ |
| IA dedicada (datos propios) | ✅ |
| Servidores dedicados | ✅ |
| Integración ticketing | ✅ |
| White label opcional | ✅ |
| Account manager dedicado | ✅ |
| SLA garantizado | ✅ |

---

## Gamificación de Upgrades

| Trigger | Acción |
|---------|--------|
| DJ Gratis supera 50 oyentes 3 veces | Oferta Creator (1 mes gratis) |
| Creator llena 100 oyentes | Badge "Rising Star" + oferta Pro |
| Pro con 500+ oyentes constantes | Oferta Business con descuento |

---

## Plan de Implementación

### Fase 1: Infraestructura (Prioridad Alta)
1. Crear tabla `ws_subscriptions` con tiers y límites
2. Crear tabla `ws_subscription_features` para feature flags
3. Hook `useSubscription` para verificar tier del usuario
4. Middleware de límites (oyentes, historial, etc.)

### Fase 2: UI de Suscripción
5. Pantalla de planes con comparativa
6. Integración Stripe para pagos recurrentes
7. Gestión de suscripción en Settings
8. Badges de tier en perfiles

### Fase 3: Features por Tier
9. Implementar límite de oyentes por tier
10. Dashboard Creator (métricas básicas)
11. Dashboard Pro (analytics completo)
12. Dashboard Business (IA + multi-admin)

### Fase 4: Gamificación
13. Sistema de triggers automáticos
14. Ofertas personalizadas
15. Badges de "Rising Star"

---

## Métricas de Éxito

| KPI | Objetivo 3 meses |
|-----|------------------|
| Conversión Gratis → Creator | 5% |
| Conversión Creator → Pro | 15% |
| Churn mensual | < 5% |
| MRR | €5,000 |

---

## Notas Técnicas

- Stripe Billing para gestión de suscripciones
- Webhooks para actualizar estado en Supabase
- Feature flags en tiempo real (sin redeploy)
- Período de gracia de 3 días si falla el pago

---

*Documento generado por el equipo virtual de WhatsSound*
