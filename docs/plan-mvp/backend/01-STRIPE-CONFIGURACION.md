# ⚙️ STRIPE CONFIGURACIÓN — Arquitecto Backend

**Prioridad:** 🔴 BLOQUEANTE  
**Esfuerzo:** 4 horas  
**Dependencias:** Ninguna  
**Bloquea a:** Frontend (UI propinas), Producto (demo)

---

## 🎯 Objetivo

Activar el sistema de propinas con pagos reales usando Stripe Connect en modo test.

---

## 📋 Tareas Paso a Paso

### 1. Crear cuenta Stripe (si no existe)
```
1. Ir a https://dashboard.stripe.com/register
2. Email: [email de WhatsSound o Vertex]
3. Verificar email
4. Completar datos de empresa (puede ser después)
```
**Tiempo:** 10 minutos

### 2. Obtener API Keys (Test Mode)
```
Dashboard → Developers → API Keys

Copiar:
- Publishable key: pk_test_...
- Secret key: sk_test_...
```
**Tiempo:** 2 minutos

### 3. Configurar Webhook
```
Dashboard → Developers → Webhooks → Add endpoint

URL: https://[proyecto].supabase.co/functions/v1/stripe-webhook
Eventos a escuchar:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
- account.updated
- payout.paid
- payout.failed

Copiar:
- Webhook signing secret: whsec_...
```
**Tiempo:** 5 minutos

### 4. Configurar Supabase Edge Functions
```bash
# En Supabase Dashboard → Edge Functions → Secrets

Añadir:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
**Tiempo:** 5 minutos

### 5. Configurar variable frontend
```bash
# En Vercel Dashboard → Settings → Environment Variables

Añadir:
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
**Tiempo:** 5 minutos

### 6. Ejecutar migración 006
```sql
-- En Supabase SQL Editor
-- Copiar contenido de supabase/migrations/006_ratings_payments_stats.sql
-- Ejecutar
```
**Tiempo:** 5 minutos

### 7. Probar flujo completo
```
1. Abrir app con ?test=angel
2. Entrar a sesión
3. Pulsar "Enviar propina"
4. Usar tarjeta de prueba: 4242 4242 4242 4242
5. Fecha: cualquier futura
6. CVC: cualquier 3 dígitos
7. Verificar en Stripe Dashboard que aparece el pago
```
**Tiempo:** 15 minutos

---

## 🧪 Tarjetas de Prueba Stripe

| Número | Resultado |
|--------|-----------|
| 4242 4242 4242 4242 | ✅ Éxito |
| 4000 0000 0000 0002 | ❌ Rechazada |
| 4000 0000 0000 9995 | ❌ Fondos insuficientes |
| 4000 0027 6000 3184 | 🔐 Requiere autenticación |

---

## 📁 Archivos Involucrados

```
src/lib/stripe.ts              ← Módulo principal (ya existe)
supabase/functions/
├── create-payment-intent/     ← Edge Function (ya existe)
├── create-connect-account/    ← Edge Function (ya existe)
└── stripe-webhook/            ← Edge Function (ya existe)
supabase/migrations/
└── 006_ratings_payments_stats.sql  ← Migración (ya existe)
```

---

## ✅ Checklist

- [ ] Cuenta Stripe creada
- [ ] API keys obtenidas
- [ ] Webhook configurado
- [ ] Secrets en Supabase
- [ ] Variable en Vercel
- [ ] Migración ejecutada
- [ ] Pago de prueba exitoso
- [ ] Webhook recibe eventos

---

## 🚨 Troubleshooting

### "Payment failed"
1. Verificar que `STRIPE_SECRET_KEY` está en Supabase
2. Verificar que es una key de TEST (empieza con `sk_test_`)
3. Revisar logs de Edge Function

### "Webhook not receiving events"
1. Verificar URL del webhook
2. Verificar que el secret es correcto
3. Probar con Stripe CLI: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`

### "Edge Function timeout"
1. Verificar que Supabase tiene el plan correcto
2. Reducir timeout en la función

---

## 📊 Métricas de Éxito

- [ ] Primer pago de prueba en <2 horas
- [ ] Webhook procesa eventos correctamente
- [ ] Propina aparece en historial del usuario

---

**Firma:** ⚙️ Arquitecto Backend  
**Fuentes:** Stripe Docs, Supabase Edge Functions, DHH (pragmatismo)
