# 🧠 Reunión de Equipo — Estado Actual y Prioridades

**Fecha:** 4 Feb 2026, 00:30  
**Convocada por:** Tanke (brazo ejecutor de Ángel)  
**Objetivo:** Evaluar estado del proyecto y definir próximos pasos críticos

---

## 👥 ASISTENTES

1. 🎨 **Arquitecto Frontend** — Dan Abramov, Kent C. Dodds, Guillermo Rauch...
2. ⚙️ **Arquitecto Backend** — Paul Shortino (Supabase), DHH, Pieter Levels...
3. ⚡ **Experto Realtime** — Chris McCord, equipo Discord, Spotify engineering...
4. 🗄️ **Experto Datos** — Craig Kerstiens, Supabase data team...
5. 📱 **Experto Mobile** — Charlie Cheever (Expo), William Candillon...
6. 🚀 **Experto DevOps** — Vercel team, Kelsey Hightower...
7. 🎯 **Experto Producto** — Julie Zhuo, Rahul Vohra, Nir Eyal...

---

## 📊 ESTADO PRESENTADO

**v2.0 en producción:** https://whatssound-app.vercel.app

| Métrica | Valor |
|---------|-------|
| Archivos .tsx | 75 |
| Tests | 51 pasando |
| Tablas Supabase | 17 |
| Pantallas Fase 1 | 14/14 ✅ |
| Pantallas Fase 2 | 6/8 |

---

## 🎨 ARQUITECTO FRONTEND

**Evaluación:** El código está bien estructurado. Expo Router + React Native es la decisión correcta. Los componentes siguen patrones consistentes.

**Preocupaciones:**
1. Veo que `scan.tsx` es un placeholder sin expo-camera. Para demo de inversores, un QR que no escanea se ve mal.
2. El estado global con Zustand está bien, pero TanStack Query no se está aprovechando para cache.

**Recomendación:**
> Prioridad ALTA: Instalar expo-camera y hacer funcional el QR scanner. Es una feature visual que impresiona en demos.

**Voto:** 🟡 Bueno, pero necesita pulir detalles visuales para demo.

---

## ⚙️ ARQUITECTO BACKEND

**Evaluación:** Supabase está bien implementado. RLS configurado. Realtime funcionando. Las 17 tablas cubren el modelo de datos.

**Preocupaciones:**
1. **Stripe no está integrado.** Las propinas son mock. Para un inversor, "propinas" sin pagos reales es una bandera roja.
2. Falta tabla `ws_session_ratings` para valoraciones de DJs.
3. No hay tracking de oyentes por hora (para stats).

**Recomendación:**
> Prioridad CRÍTICA: Stripe Connect. Un inversor preguntará "¿cómo monetizáis?" y hay que poder mostrar el flujo completo. Aunque sea en modo test.

**Voto:** 🟡 Sólido técnicamente, pero la monetización es el core del negocio y está en mock.

---

## ⚡ EXPERTO REALTIME

**Evaluación:** Supabase Realtime está bien usado. Suscripciones a postgres_changes en las pantallas correctas. El chat funciona.

**Preocupaciones:**
1. El walkie-talkie (audio-live.tsx) es mock. El audio en tiempo real es complejo y no está implementado.
2. No hay Presence API para mostrar "quién está escuchando ahora".

**Recomendación:**
> Para demo: Presence es más importante que walkie-talkie. Ver "47 personas escuchando" en tiempo real es wow factor.

**Voto:** 🟢 El realtime core funciona bien. Walkie-talkie puede ser post-MVP.

---

## 🗄️ EXPERTO DATOS

**Evaluación:** El schema está limpio. Índices correctos. RLS bien configurado.

**Preocupaciones:**
1. Faltan tablas: `ws_session_ratings`, `ws_hourly_stats`, `ws_payment_methods`, `ws_dj_payouts`
2. No hay backups configurados (Supabase los tiene, pero ¿está habilitado?).
3. Los datos seed son buenos para demo pero hay que poder limpiarlos fácil.

**Recomendación:**
> Crear migración 005 con las tablas faltantes. Es 30 minutos de trabajo y cierra muchos TODOs del código.

**Voto:** 🟢 Base sólida. Faltan tablas secundarias.

---

## 📱 EXPERTO MOBILE

**Evaluación:** Expo 54 + Expo Router es el stack correcto. El código es deployable a iOS/Android.

**Preocupaciones:**
1. **No hay EAS Build configurado.** Sin builds nativos, no podemos probar push notifications ni features nativas.
2. El QR scanner necesita expo-camera que requiere permisos nativos.
3. No hay deep linking configurado para `whatssound://` URLs.

**Recomendación:**
> Configurar EAS Build. Sin esto, estamos limitados a web. Los inversores querrán ver la app en un iPhone real.

**Voto:** 🟡 Web funciona perfecto. Mobile nativo necesita trabajo.

---

## 🚀 EXPERTO DEVOPS

**Evaluación:** Vercel deploy funciona. CI básico con los tests. Supabase en producción.

**Preocupaciones:**
1. No hay GitHub Actions para CI/CD automático.
2. No hay Sentry para error tracking.
3. No hay analytics (PostHog recomendado).
4. Variables de entorno están en .env local, ¿están todas en Vercel?

**Recomendación:**
> Mínimo: GitHub Actions para tests + deploy automático. Es profesionalismo que los inversores esperan.

**Voto:** 🟡 Deploy manual funciona, pero falta automatización.

---

## 🎯 EXPERTO PRODUCTO

**Evaluación:** El producto tiene PMF potencial. "WhatsApp de la música" es un pitch claro. Las features core están.

**Preocupaciones:**
1. **Onboarding es crítico y no está probado con usuarios reales.**
2. El flujo de propinas es el diferenciador y está incompleto.
3. No hay métricas de engagement definidas.

**Recomendación:**
> Para demo de inversores, el flujo debe ser:
> 1. Abrir app → ver sesión en vivo → unirse → pedir canción → votar → enviar propina
> 
> Ese flujo debe funcionar PERFECTO. Todo lo demás es secundario.

**North Star Metric:** Canciones pedidas por sesión activa.

**Voto:** 🟡 El producto está, pero falta el "momento mágico" pulido.

---

## 📋 VOTACIÓN FINAL

| Experto | Voto | Prioridad #1 |
|---------|------|--------------|
| Frontend | 🟡 | QR Scanner funcional |
| Backend | 🟡 | Stripe Connect |
| Realtime | 🟢 | Presence API |
| Datos | 🟢 | Migración tablas |
| Mobile | 🟡 | EAS Build |
| DevOps | 🟡 | GitHub Actions |
| Producto | 🟡 | Flujo propinas completo |

**Consenso:** 🟡 **BUENO CON RESERVAS**

El producto está técnicamente sólido pero faltan piezas clave para una demo de inversores convincente.

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### Semana 1: Core Demo (CRÍTICO)
1. **Stripe Connect** — Propinas reales aunque sea en modo test
2. **Migración 005** — Tablas faltantes (ratings, payments, stats)
3. **QR Scanner** — expo-camera + funcionalidad real

### Semana 2: Polish
4. **EAS Build** — App nativa para demo en iPhone
5. **GitHub Actions** — CI/CD profesional
6. **Presence API** — "47 escuchando ahora" en tiempo real

### Post-Demo
7. Push notifications
8. Walkie-talkie
9. Analytics (PostHog)

---

## 💬 MENSAJE AL DIRECTOR (Ángel)

**De: Equipo de Superexpertos**

> Ángel, el código está bien. Tanke ha conectado casi todo a Supabase y la estructura es sólida.
>
> Pero para una demo de inversores, **Stripe es innegociable**. Un inversor va a preguntar "¿cómo gana dinero esto?" y si la respuesta es "las propinas son mock", perdemos credibilidad.
>
> Nuestra recomendación: **2-3 días enfocados en Stripe Connect + una migración de BD**. Con eso, el flujo completo funciona y el producto se puede demostrar de principio a fin.
>
> El resto (QR, EAS, CI/CD) es importante pero secundario. Primero el dinero.

**Firma:** Los 7 Superexpertos de WhatsSound

---

*Reunión documentada: 4 Feb 2026, 00:30*
