# 📋 FASE REVENUE READY — Lista de Tareas Detallada

**Versión:** V4.1
**Duración:** 2 semanas
**Fecha inicio:** 2026-02-04

---

## ⚠️ PREMISAS IMPORTANTES

```
1. NO necesitamos cuentas reales en Stripe/Firebase/etc. ahora
2. NO necesitamos APIs externas conectadas
3. TODO debe funcionar SIMULADO pero END-TO-END
4. Una pestaña en Admin Dashboard simula las plataformas externas
5. Los datos pasan por la BD real (ws_transactions, etc.)
6. Cuando conectemos Stripe real, solo cambiamos el "handler"
7. La demo debe ser 100% funcional para inversores
```

---

## 🎛️ PESTAÑA ADMIN: "Simulador Externo"

Nueva pestaña en `/admin/simulator` que simula:
- Confirmación de pagos Stripe
- Envío de push notifications
- Webhooks entrantes
- Errores de pago (para testing)

**Flujo:**
```
Usuario da propina → BD registra "pending" → Admin ve en Simulator
→ Admin click "Confirmar pago" → BD actualiza "completed"
→ DJ recibe notificación → Confetti en UI
```

---

## 📝 TAREAS DETALLADAS

### BLOQUE 1: INFRAESTRUCTURA DE PAGOS (Días 1-3)

#### 1.1 Tabla de Transacciones
- [ ] Crear migración `ws_transactions`
  ```sql
  - id UUID
  - type ENUM (tip, golden_boost, permanent_sponsor)
  - from_user_id UUID
  - to_user_id UUID (nullable, para boosts sin destinatario)
  - amount_cents INT
  - fee_cents INT (comisión WhatsSound)
  - net_cents INT (lo que recibe el DJ)
  - status ENUM (pending, completed, failed, refunded)
  - stripe_payment_intent_id TEXT (para futuro)
  - metadata JSONB
  - created_at, updated_at
  ```
- [ ] RLS policies para transactions
- [ ] Índices para queries frecuentes

#### 1.2 Servicio de Pagos (Simulado)
- [ ] Crear `/src/lib/payments.ts`
  - `createPaymentIntent(amount, type, fromUser, toUser)`
  - `confirmPayment(transactionId)` — llamado por simulator
  - `failPayment(transactionId, reason)`
  - `refundPayment(transactionId)`
- [ ] Crear `/src/hooks/usePayments.ts`
  - Hook para UI de propinas/boosts

#### 1.3 Preparación Stripe (Sin conectar)
- [ ] Crear `/src/lib/stripe-adapter.ts`
  - Interface que define los métodos
  - Implementación "mock" que usa BD directamente
  - Comentarios donde irá Stripe real
- [ ] Documentar en `/docs/deploy/STRIPE-READY.md`
  - Qué variables de entorno necesitará
  - Qué endpoints crear
  - Cómo cambiar de mock a real

---

### BLOQUE 2: PUSH NOTIFICATIONS (Días 4-5)

#### 2.1 Infraestructura Push (Simulada)
- [ ] Crear tabla `ws_push_tokens`
  ```sql
  - user_id UUID
  - expo_push_token TEXT
  - device_info JSONB
  - created_at
  ```
- [ ] Crear tabla `ws_notifications_log`
  ```sql
  - id UUID
  - user_id UUID
  - type ENUM (dj_live, golden_boost, mention, tip_received)
  - title TEXT
  - body TEXT
  - data JSONB
  - status ENUM (pending, sent, failed)
  - sent_at TIMESTAMPTZ
  ```

#### 2.2 Servicio Push (Simulado)
- [ ] Crear `/src/lib/push-notifications.ts`
  - `registerPushToken(userId, token)`
  - `sendPush(userId, notification)` — guarda en log, no envía real
  - `sendPushToMany(userIds, notification)`
- [ ] Crear `/src/hooks/usePushNotifications.ts`
  - Registrar token al abrir app
  - Pedir permiso (simular aceptación en demo)

#### 2.3 Triggers de Push
- [ ] Cuando DJ inicia sesión → push a seguidores
- [ ] Cuando alguien da propina → push al DJ
- [ ] Cuando mencionan en chat → push al mencionado
- [ ] Recordatorio Golden Boost (domingo)

---

### BLOQUE 3: ADMIN SIMULATOR (Días 6-7)

#### 3.1 Nueva Pestaña Admin
- [ ] Crear `/app/admin/simulator.tsx`
- [ ] Secciones:
  - **Pagos Pendientes** — Lista de transactions pending
  - **Confirmar/Fallar** — Botones para simular Stripe
  - **Push Queue** — Notificaciones pendientes
  - **Enviar Push** — Simular envío (marca como sent)
  - **Webhooks Log** — Ver qué llegaría de Stripe

#### 3.2 UI del Simulator
- [ ] Card por transacción pendiente
  - Muestra: tipo, monto, usuario, fecha
  - Botones: ✅ Confirmar | ❌ Fallar | 🔄 Refund
- [ ] Card por push pendiente
  - Muestra: usuario, tipo, título
  - Botón: 📤 Marcar como enviado
- [ ] Log de acciones simuladas

#### 3.3 Efectos en UI Principal
- [ ] Cuando se confirma pago:
  - DJ ve notificación en tiempo real
  - Confetti si es primera propina
  - Badge actualizado
- [ ] Cuando se "envía" push:
  - Log se actualiza
  - (En real, Expo lo enviaría)

---

### BLOQUE 4: SEGURIDAD BÁSICA (Días 8-9)

#### 4.1 Rate Limiting
- [ ] Crear middleware `/api/middleware/rate-limit.js`
  - 100 req/min por IP
  - 20 req/min para pagos
  - Headers X-RateLimit-*
- [ ] Tabla `ws_rate_limits` (opcional, puede ser in-memory)

#### 4.2 Validaciones Servidor
- [ ] Validar montos en Edge Function
  - Propina: min €1, max €50
  - Golden Boost: exactamente €4.99
  - Patrocinio: exactamente €19.99
- [ ] Validar que usuario tiene Golden Boost disponible
- [ ] Validar que DJ existe y acepta propinas

#### 4.3 Logs de Auditoría
- [ ] Crear tabla `ws_audit_log`
  ```sql
  - id UUID
  - action TEXT (payment_created, payment_confirmed, etc.)
  - user_id UUID
  - ip_address TEXT
  - metadata JSONB
  - created_at
  ```
- [ ] Loggear todas las acciones de pago

---

### BLOQUE 5: MEJORAS UI (Días 10-11)

#### 5.1 Flujo de Propina Mejorado
- [ ] Modal de propina con:
  - Presets: €1, €2, €5, €10, Custom
  - Input para mensaje opcional
  - Preview de comisiones
  - Botón "Enviar propina"
- [ ] Estado "procesando" mientras pending
- [ ] Confetti + sonido cuando confirmed
- [ ] Notificación al DJ en tiempo real

#### 5.2 Flujo Golden Boost Mejorado
- [ ] Contador visible de boosts disponibles
- [ ] Modal de compra si no tiene
- [ ] Animación épica al dar boost
- [ ] Push al DJ (simulado)

#### 5.3 Open Graph para Shares
- [ ] Crear `/api/og/session/[id].tsx`
  - Imagen dinámica con:
    - Foto del DJ
    - Nombre de sesión
    - Oyentes actuales
    - "Únete en WhatsSound"
- [ ] Meta tags en session page

---

### BLOQUE 6: TESTING Y POLISH (Días 12-14)

#### 6.1 Testing Manual
- [ ] Flujo completo propina (crear → confirmar en simulator)
- [ ] Flujo completo Golden Boost
- [ ] Flujo completo Patrocinio Permanente
- [ ] Push notifications (crear → marcar enviado)
- [ ] Rate limiting (verificar bloqueo)

#### 6.2 Edge Cases
- [ ] Pago fallido → mensaje al usuario
- [ ] Usuario sin Golden Boost intenta dar → modal compra
- [ ] Doble click en propina → prevenir duplicados
- [ ] Sesión termina mientras pagas → manejar gracefully

#### 6.3 Polish
- [ ] Todos los textos en español
- [ ] Animaciones suaves
- [ ] Loading states consistentes
- [ ] Error messages claros

---

## 📁 Archivos a Crear

```
src/lib/
├── payments.ts
├── stripe-adapter.ts
├── push-notifications.ts

src/hooks/
├── usePayments.ts
├── usePushNotifications.ts

app/admin/
├── simulator.tsx

api/
├── og/session/[id].tsx
├── middleware/rate-limit.js

supabase/migrations/
├── XXX_transactions.sql
├── XXX_push_tokens.sql
├── XXX_notifications_log.sql
├── XXX_audit_log.sql

docs/deploy/
├── STRIPE-READY.md
├── PUSH-READY.md
```

---

## ✅ Checklist Final

- [ ] Propinas funcionan end-to-end (simulado)
- [ ] Golden Boost comprable (simulado)
- [ ] Patrocinio Permanente funcional (simulado)
- [ ] Push notifications en log (simulado)
- [ ] Admin Simulator operativo
- [ ] Rate limiting activo
- [ ] Validaciones servidor funcionando
- [ ] Open Graph shares bonitos
- [ ] Documentación de "cómo conectar real"
- [ ] Demo lista para inversores

---

*Documento creado: 2026-02-04*
*Fase: Revenue Ready V4.1*
