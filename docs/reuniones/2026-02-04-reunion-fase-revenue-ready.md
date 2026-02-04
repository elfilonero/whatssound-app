# 📋 Reunión: Fase Revenue Ready

**Fecha:** 2026-02-04
**Convocante:** Director de Orquesta (Tanke)
**Proyecto:** WhatsSound V4 → V4.1

---

## 👥 Asistentes

| # | Experto | Por qué está |
|---|---------|--------------|
| 08 | 🔮 Visionario Producto | Dirección estratégica |
| 09 | 💰 Monetización | Stripe, pricing, pagos |
| 10 | 📈 Growth | Push, viralidad, retención |
| 13 | 🔒 Seguridad | Rate limiting, protección |
| 02 | ⚙️ Arquitecto Backend | Implementación Supabase |
| 06 | 🚀 DevOps | Deploy, monitoring |

---

## 🎯 Objetivo de la Reunión

Definir el scope exacto de la **Fase Revenue Ready** (2 semanas) para que WhatsSound pueda generar ingresos reales.

---

## 💬 TRANSCRIPCIÓN DE LA REUNIÓN

### VISIONARIO (08):
> "Bien, equipo. El producto está sólido pero sin caja registradora. Necesitamos 3 cosas en este orden:
> 1. Stripe para cobrar
> 2. Push notifications para retener
> 3. Protección básica para no caer en día 1
> 
> Sin estas 3, no podemos lanzar a usuarios reales."

### MONETIZACIÓN (09):
> "De acuerdo. Mi plan para Stripe:
> - **Semana 1:** Stripe Connect para payouts a DJs, Payment Intents para propinas
> - **Semana 2:** Webhooks para confirmar pagos, Golden Boost comprable
> 
> Price points que recomiendo mantener:
> - Propinas: mínimo €1, máximo €50
> - Golden Boost: €4.99
> - Patrocinio Permanente: €19.99
> 
> Comisión WhatsSound: 15% en propinas, 100% en boosts"

### GROWTH (10):
> "Push notifications son críticas. Mi prioridad:
> 1. 'Tu DJ favorito está en vivo' — esto es oro
> 2. 'Tienes 1 Golden Boost disponible' — recordatorio semanal
> 3. 'X te mencionó en el chat' — engagement
> 
> También necesitamos Open Graph mejorado para que los shares en WhatsApp se vean bien. Eso es quick win."

### SEGURIDAD (13):
> "Antes de abrir la caja, hay que protegerla. Mínimo:
> - Rate limiting: 100 req/min por usuario
> - Validación de montos en servidor (no confiar en cliente)
> - Sanitización de inputs en chat
> - Logs de transacciones para auditoría
> 
> También recomiendo 2FA opcional para DJs con subs, pero eso puede ser fase 2."

### ARQUITECTO BACKEND (02):
> "Técnicamente, esto es lo que necesito implementar:
> - Edge Function para procesar pagos (Supabase Edge)
> - Tabla `ws_transactions` para historial
> - Webhooks endpoint en Vercel
> - Push via Expo Push Notifications (ya está el SDK)
> 
> Estimación: 5-7 días de código."

### DEVOPS (06):
> "Para el deploy:
> - Sentry para errores en producción
> - Variables de entorno para Stripe keys
> - Monitoring básico de Edge Functions
> - Alertas si hay errores de pago
> 
> El CI/CD ya está, solo hay que añadir los checks."

---

## ✅ DECISIONES TOMADAS

### IMPLEMENTAR (Fase Revenue Ready - 2 semanas)

| Prioridad | Feature | Responsable | Días |
|-----------|---------|-------------|------|
| P0 | Stripe Connect + Payment Intents | Monetización + Backend | 3 |
| P0 | Webhooks de confirmación | Backend | 1 |
| P0 | Push notifications (3 tipos) | Growth + Mobile | 2 |
| P0 | Rate limiting básico | Seguridad + Backend | 1 |
| P1 | Open Graph mejorado | Growth + Frontend | 1 |
| P1 | Tabla ws_transactions | Datos | 0.5 |
| P1 | Sentry + alertas | DevOps | 1 |
| P2 | Validación montos servidor | Seguridad | 0.5 |

**Total estimado:** 10 días de trabajo

### NO IMPLEMENTAR AHORA (Fase siguiente)

- Suscripciones a DJ (requiere más diseño)
- 2FA para DJs
- Referral program completo
- Clips compartibles

---

## 🔥 WOW MOMENTS IDENTIFICADOS

1. **"Tu DJ favorito está en vivo"** — Push que lleva directo a la sesión
2. **Primera propina confirmada** — Confetti + sonido + notificación al DJ
3. **Golden Boost dado** — Animación épica que el DJ ve en vivo
4. **Share bonito** — Preview card con foto del DJ, nombre de sesión, oyentes actuales

---

## 📊 KPIs para validar éxito

| Métrica | Target Semana 1 | Target Semana 2 |
|---------|-----------------|-----------------|
| Transacciones procesadas | 1+ | 10+ |
| Push opt-in rate | 40%+ | 50%+ |
| Errores de pago | <5% | <2% |
| Tiempo a primera propina | <10 min | <5 min |

---

## 📁 Entregables

1. `/src/lib/stripe.ts` — Cliente Stripe
2. `/api/webhooks/stripe.js` — Endpoint webhooks
3. `/src/hooks/usePushNotifications.ts` — Hook push
4. `/supabase/migrations/XXX_transactions.sql` — Tabla transacciones
5. `docs/deploy/STRIPE-SETUP.md` — Guía de configuración

---

## 🗓️ Timeline

```
Semana 1 (Feb 4-10):
├── Lun-Mar: Stripe Connect setup + Payment Intents
├── Mié: Webhooks + tabla transactions
├── Jue-Vie: Push notifications

Semana 2 (Feb 11-17):
├── Lun: Rate limiting + validaciones
├── Mar: Open Graph + shares
├── Mié: Sentry + monitoring
├── Jue: Testing E2E
├── Vie: Deploy a producción
```

---

## 🎤 Conclusión del Visionario

> "El plan está claro. En 2 semanas tendremos:
> - Pagos funcionando (negocio real)
> - Push notifications (retención)
> - Protección básica (seguridad)
> 
> Esto nos permite lanzar a los primeros 100 usuarios reales. El equipo está alineado. A ejecutar."

---

*Reunión documentada por: Director de Orquesta*
*Fecha: 2026-02-04 13:46 CET*
