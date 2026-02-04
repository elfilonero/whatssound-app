# 🧠 REUNIÓN PLENARIA — MVP, Innovación y Monetización

**Fecha:** 4 Feb 2026, 01:20  
**Convocada por:** Ángel Fernández (Director de Producto)  
**Moderador:** Tanke  
**Asistentes:** Los 7 Superexpertos de WhatsSound

---

## 📋 AGENDA

1. Estado actual de la aplicación
2. Definición del MVP real
3. Propuestas de innovación (SIN IA)
4. Modelo de monetización (estilo WhatsApp)
5. Plan de implementación

---

## 1️⃣ ESTADO ACTUAL — Ronda de Evaluación

### 🎨 ARQUITECTO FRONTEND

> **Estado técnico:** Sólido. 75 archivos .tsx, estructura limpia con Expo Router, design system consistente.
>
> **Lo que funciona:**
> - Navegación fluida entre tabs y pantallas
> - Componentes reutilizables bien organizados
> - Theming oscuro coherente
>
> **Lo que falta para MVP:**
> - Animaciones de transición (el app se siente "plana")
> - Skeleton loaders (ahora hay spinners genéricos)
> - Haptic feedback en acciones importantes
>
> **Evaluación:** 7/10 — Funcional pero sin "magia" visual.

---

### ⚙️ ARQUITECTO BACKEND

> **Estado técnico:** Muy bueno. Supabase bien implementado, RLS configurado, 22 tablas.
>
> **Lo que funciona:**
> - Auth flow completo
> - Realtime en chat y sesiones
> - Sistema de propinas con Stripe (código listo)
>
> **Lo que falta para MVP:**
> - Stripe configurado y probado
> - Rate limiting en Edge Functions
> - Backups automatizados
>
> **Evaluación:** 8/10 — Backend listo, falta activar pagos.

---

### ⚡ EXPERTO REALTIME

> **Estado técnico:** Funcional pero básico.
>
> **Lo que funciona:**
> - Supabase Realtime para chat y cola
> - Suscripciones a cambios de BD
>
> **Lo que falta para MVP:**
> - **Presence API** — No sabemos quién está escuchando AHORA
> - Indicadores de "escribiendo..."
> - Sincronización de posición de canción entre usuarios
>
> **Oportunidad de innovación:**
> El "X personas escuchando ahora" es un diferenciador BRUTAL. WhatsApp no tiene esto. Spotify sí, pero no en contexto social.
>
> **Evaluación:** 6/10 — Falta el factor "en vivo" real.

---

### 🗄️ EXPERTO EN DATOS

> **Estado técnico:** Schema sólido, bien normalizado.
>
> **Lo que funciona:**
> - 22 tablas con relaciones claras
> - Índices en campos frecuentes
> - RLS para seguridad
>
> **Lo que falta para MVP:**
> - Ejecutar migración 006 en producción
> - Datos de prueba más realistas
> - Limpieza de seeds para demo
>
> **Evaluación:** 8/10 — Base de datos lista.

---

### 📱 EXPERTO MOBILE

> **Estado técnico:** Web funciona, nativo pendiente.
>
> **Lo que funciona:**
> - PWA desplegada en Vercel
> - Expo código compatible con iOS/Android
>
> **Lo que falta para MVP:**
> - **EAS Build configurado** — Sin esto no hay app nativa
> - Push notifications
> - Deep links nativos (`whatssound://`)
>
> **Crítico:** Para inversores, mostrar la app en un iPhone real es 10x más impactante que en web.
>
> **Evaluación:** 5/10 — Solo web, nativo es imprescindible.

---

### 🚀 EXPERTO DEVOPS

> **Estado técnico:** Deploy manual funciona, falta automatización.
>
> **Lo que funciona:**
> - Vercel deploy
> - Supabase en producción
>
> **Lo que falta para MVP:**
> - GitHub Actions (CI/CD)
> - Sentry (error tracking)
> - PostHog (analytics)
> - Variables de entorno documentadas
>
> **Evaluación:** 6/10 — Funciona pero es artesanal.

---

### 🎯 EXPERTO PRODUCTO

> **Estado del producto:** Tiene potencial pero le falta el "momento mágico".
>
> **Lo que funciona:**
> - Concepto claro: "WhatsApp de la música"
> - Flujo básico completo
> - UI limpia
>
> **Lo que falta para MVP:**
> - **Onboarding emocional** — Ahora es frío, funcional
> - **Momento WOW** — Cuando entras a una sesión y ves gente escuchando contigo
> - **Loop de engagement** — ¿Por qué vuelvo mañana?
>
> **Problema de monetización actual:**
> Solo propinas = dependes de la generosidad. WhatsApp no cobra a usuarios, cobra a EMPRESAS.
>
> **Evaluación:** 6/10 — Funciona, no engancha.

---

## 📊 EVALUACIÓN CONSOLIDADA

| Área | Puntuación | Bloqueante para MVP |
|------|------------|---------------------|
| Frontend | 7/10 | No |
| Backend | 8/10 | Sí (Stripe) |
| Realtime | 6/10 | Sí (Presence) |
| Datos | 8/10 | No |
| Mobile | 5/10 | Sí (EAS Build) |
| DevOps | 6/10 | No |
| Producto | 6/10 | Sí (Engagement) |

**Media:** 6.6/10  
**Veredicto:** Funcional pero no memorable.

---

## 2️⃣ DEFINICIÓN DEL MVP REAL

### 🎯 EXPERTO PRODUCTO

> El MVP no es "todas las features funcionando". Es el **mínimo para validar que la gente quiere esto**.
>
> **MVP de WhatsSound debe responder:**
> 1. ¿La gente quiere escuchar música con otros en tiempo real?
> 2. ¿Los usuarios pagarían propinas a DJs?
> 3. ¿Los DJs quieren usar esto para sus sesiones?

### Flujo MVP (1 minuto de demo)

```
1. Abro app → Veo "47 personas escuchando ahora" 🔥
2. Entro a sesión "Viernes Latino"
3. Veo: canción actual + chat + cola
4. Pido una canción → aparece en cola
5. Alguien vota mi canción → sube
6. Doy €2 de propina al DJ → animación confeti
7. DJ agradece en chat → me siento parte de algo
```

**Elementos CRÍTICOS del MVP:**
- ✅ Ver gente escuchando (Presence)
- ✅ Pedir y votar canciones
- ✅ Propinas con feedback visual
- ✅ Chat en vivo
- ❌ Grupos (post-MVP)
- ❌ Chats privados (post-MVP)
- ❌ Historial completo (post-MVP)

---

## 3️⃣ PROPUESTAS DE INNOVACIÓN (SIN IA)

### 🎨 ARQUITECTO FRONTEND

> **Propuesta 1: "Pulso de la sesión"**
> 
> Un indicador visual que late con el ritmo de la canción. Cuando hay mucha actividad (votos, propinas, mensajes), el pulso se intensifica.
> 
> - Implementación: Animación CSS/Reanimated basada en eventos por segundo
> - Impacto: La sesión se siente VIVA
> - Esfuerzo: 4 horas
>
> **Propuesta 2: "Reacciones flotantes"**
>
> Cuando alguien reacciona (🔥❤️👏), la reacción flota desde abajo hacia arriba como en TikTok Live.
>
> - Implementación: Reanimated + gestos
> - Impacto: Feedback social inmediato
> - Esfuerzo: 6 horas

---

### ⚡ EXPERTO REALTIME

> **Propuesta 3: "Quién está aquí" (Presence)**
>
> Mostrar avatares de las personas escuchando. Cuando alguien entra/sale, animación sutil.
>
> ```
> 🎧 47 escuchando
> [👤][👤][👤][👤][👤] +42 más
> ```
>
> - Implementación: Supabase Presence API (ya incluida)
> - Impacto: DIFERENCIADOR CLAVE
> - Esfuerzo: 8 horas
>
> **Propuesta 4: "Sincronización de momento"**
>
> Todos ven el mismo segundo de la canción. Cuando el DJ pausa, todos pausan.
>
> - Implementación: Broadcast de posición cada 5 segundos
> - Impacto: Sensación de "estamos juntos"
> - Esfuerzo: 12 horas

---

### 🎯 EXPERTO PRODUCTO

> **Propuesta 5: "Racha de sesiones"**
>
> Gamificación simple: "Has escuchado 3 sesiones esta semana 🔥"
>
> - No requiere IA, solo contador
> - Genera hábito de volver
> - Esfuerzo: 4 horas
>
> **Propuesta 6: "DJ del momento"**
>
> Ranking semanal de DJs por propinas/oyentes. Visible en Discover.
>
> - Query SQL simple sobre datos existentes
> - Genera competencia sana entre DJs
> - Esfuerzo: 6 horas
>
> **Propuesta 7: "Compartir momento"**
>
> Botón para compartir "Estoy escuchando X en WhatsSound" con link directo a la sesión.
>
> - Share API nativa
> - Crecimiento orgánico
> - Esfuerzo: 2 horas

---

### ⚙️ ARQUITECTO BACKEND

> **Propuesta 8: "Sesiones programadas"**
>
> El DJ puede anunciar: "Sesión el viernes a las 22:00". Los usuarios reciben notificación.
>
> - Nueva tabla `ws_scheduled_sessions`
> - Cron job para notificaciones
> - Esfuerzo: 8 horas
>
> **Propuesta 9: "Cola inteligente por votos"**
>
> Las canciones suben/bajan en tiempo real según votos. El DJ ve cuál tiene más demanda.
>
> - Ya tenemos la base, solo mejorar UI
> - Esfuerzo: 4 horas

---

### 📱 EXPERTO MOBILE

> **Propuesta 10: "Mini reproductor persistente"**
>
> Cuando sales de la sesión, un mini reproductor queda abajo (como Spotify).
>
> - Puedes navegar la app sin perder el audio
> - Esfuerzo: 10 horas
>
> **Propuesta 11: "Widgets de sesión"**
>
> Widget de iOS/Android que muestra la sesión actual sin abrir la app.
>
> - Expo tiene soporte experimental
> - Esfuerzo: 16 horas (post-MVP)

---

## 4️⃣ MODELO DE MONETIZACIÓN

### 🎯 EXPERTO PRODUCTO

> **Cómo monetiza WhatsApp:**
> 1. **WhatsApp Business API** — Empresas pagan por enviar mensajes (notificaciones, soporte)
> 2. **Click-to-WhatsApp Ads** — Publicidad en Meta que abre chat
> 3. **WhatsApp Payments** — Comisión en transferencias (India, Brasil)
>
> **Lección:** WhatsApp NO cobra a usuarios. Cobra a EMPRESAS por acceder a los usuarios.

### Modelo propuesto para WhatsSound

#### 💰 INGRESOS ACTUALES (implementado)
| Fuente | Comisión | Estado |
|--------|----------|--------|
| Propinas a DJs | 13% | ✅ Código listo |

#### 💰 INGRESOS PROPUESTOS (nuevos)

**1. WhatsSound Business (para locales/venues)**
> Bares, discotecas, festivales pagan suscripción mensual para:
> - Crear sesiones oficiales verificadas ✓
> - Estadísticas avanzadas de su audiencia
> - Integración con su sistema de sonido
> - Promoción en Discover
>
> **Precio:** €29-99/mes según tamaño
> **Esfuerzo:** 40 horas (nuevo módulo)

**2. DJ Pro (suscripción para DJs)**
> DJs serios pagan para:
> - Perfil verificado con checkmark
> - Estadísticas detalladas de sus sesiones
> - Programar sesiones con notificación a seguidores
> - Cobrar entrada a sesiones premium
> - Retirar propinas sin espera (instant payout)
>
> **Precio:** €9.99/mes
> **Esfuerzo:** 20 horas

**3. Sesiones Premium (pay-per-view)**
> DJs famosos pueden cobrar entrada:
> - Usuario paga €2-10 para entrar a sesión exclusiva
> - WhatsSound toma 20%
> - DJ recibe 80%
>
> **Esfuerzo:** 16 horas (extender sistema de pagos)

**4. Promoción de canciones**
> Sellos discográficos pagan para:
> - Que su canción aparezca sugerida cuando alguien busca
> - NO es intrusivo, es "contenido sugerido"
>
> **Precio:** €0.05-0.20 por impresión
> **Esfuerzo:** 24 horas

**5. Datos agregados (B2B)**
> Vender insights a sellos/artistas:
> - "Bad Bunny fue el más pedido en sesiones de reggaetón en España"
> - Datos AGREGADOS y ANÓNIMOS
>
> **Esfuerzo:** 32 horas + legal

---

### 📊 PROYECCIÓN DE INGRESOS

**Escenario: 10,000 usuarios activos mensuales**

| Fuente | Conversión | Ingreso/mes |
|--------|------------|-------------|
| Propinas (13%) | 5% dan propinas, €3 avg | €195 |
| DJ Pro | 2% de DJs (200) | €1,998 |
| WhatsSound Business | 50 locales | €2,450 |
| Sesiones Premium | 1% paga €5 avg | €500 |
| **TOTAL** | | **€5,143/mes** |

**Escenario: 100,000 usuarios**
- Propinas: €1,950
- DJ Pro: €9,990
- Business: €14,700
- Premium: €5,000
- Promoción canciones: €3,000
- **TOTAL: €34,640/mes**

---

### 🗳️ VOTACIÓN DE MONETIZACIÓN

| Modelo | Votos | Prioridad |
|--------|-------|-----------|
| Propinas (ya hecho) | 7/7 | ✅ MVP |
| DJ Pro | 6/7 | Alta |
| Sesiones Premium | 5/7 | Media |
| WhatsSound Business | 5/7 | Media |
| Promoción canciones | 3/7 | Baja |
| Datos B2B | 2/7 | Post-lanzamiento |

---

## 5️⃣ PLAN DE IMPLEMENTACIÓN

### 🎯 FASE MVP (2 semanas)

**Semana 1: Core funcional**
| Día | Tarea | Responsable | Horas |
|-----|-------|-------------|-------|
| L | Configurar Stripe + probar propinas | Backend | 4 |
| L | Implementar Presence API | Realtime | 8 |
| M | Reacciones flotantes | Frontend | 6 |
| M | EAS Build configuración | Mobile | 4 |
| X | "Quién está aquí" UI | Frontend + Realtime | 6 |
| X | GitHub Actions CI/CD | DevOps | 4 |
| J | Compartir momento (Share API) | Frontend | 2 |
| J | Pulso de la sesión | Frontend | 4 |
| V | Testing integrado | Todos | 8 |

**Semana 2: Polish + Demo**
| Día | Tarea | Responsable | Horas |
|-----|-------|-------------|-------|
| L | Build iOS/Android con EAS | Mobile | 4 |
| L | Skeleton loaders | Frontend | 4 |
| M | DJ del momento (ranking) | Backend + Frontend | 6 |
| M | Sesiones programadas (base) | Backend | 8 |
| X | Racha de sesiones | Producto + Frontend | 4 |
| X | Onboarding emocional | Producto + Frontend | 6 |
| J | Testing en dispositivos reales | Mobile | 4 |
| J | Preparar demo para inversores | Producto | 4 |
| V | Deploy final + documentación | DevOps | 4 |

**Total: 90 horas de desarrollo**

---

### 🎯 FASE POST-MVP (1 mes)

1. **DJ Pro** — Suscripción mensual para DJs
2. **Sesiones Premium** — Pay-per-view
3. **WhatsSound Business** — Para locales
4. **Mini reproductor persistente**
5. **Push notifications completas**

---

## 📋 DECISIONES TOMADAS

1. **MVP enfocado en "estar juntos"** — Presence es el diferenciador
2. **Monetización B2B primero** — DJ Pro y Business antes que ads
3. **Sin IA** — Todo lo propuesto es algorítmico simple
4. **Mobile nativo es crítico** — EAS Build esta semana
5. **Propinas ya funcionan** — Solo falta activar Stripe

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

1. [ ] Configurar Stripe (API keys)
2. [ ] Implementar Presence API
3. [ ] Configurar EAS Build
4. [ ] Reacciones flotantes
5. [ ] "Quién está aquí" UI

---

**Firman:**
- 🎨 Arquitecto Frontend
- ⚙️ Arquitecto Backend
- ⚡ Experto Realtime
- 🗄️ Experto Datos
- 📱 Experto Mobile
- 🚀 Experto DevOps
- 🎯 Experto Producto

*Reunión cerrada: 4 Feb 2026, 01:45*
