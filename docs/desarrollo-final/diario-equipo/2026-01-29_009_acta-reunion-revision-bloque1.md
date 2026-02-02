# 📋 ACTA DE REUNIÓN — Revisión Bloque 1
**Fecha:** 2026-01-29 08:04 CST  
**Convocada por:** Ángel (Director)  
**Facilitador:** Leo (Tech Lead)  

## Asistentes
- 🧪 QA Lead
- ⚙️ Arquitecto Backend  
- 🎨 UI/UX Lead
- 📋 Product Manager
- 🔧 DevOps Engineer
- ✍️ Copywriter
- 🦁 Leo (Tech Lead / ejecución)

---

## 1. ESTADO ACTUAL

| Concepto | Cantidad |
|----------|----------|
| Pantallas programadas | 27 únicas (31 archivos con layouts) |
| Capturas verificadas | 27 |
| Componentes UI | 9 (Button, Input, Card, Badge, Avatar, Modal, Toast, EmptyState, BottomSheet) |
| Theme tokens | 3 archivos (colors, typography, spacing) |
| Documentos equipo | 8 |
| Errores de build | 0 |

---

## 2. LO QUE DICE CADA EQUIPO

### 🧪 QA Lead
- **8 bugs críticos**, 2 ya corregidos (Avatar xs, Input icon)
- **Pendientes urgentes:** OTP countdown no funciona, animaciones splash se recrean, rutas sin declarar en Stack
- **Recomendación:** Corregir los 6 bugs críticos restantes ANTES de seguir con pantallas nuevas

### ⚙️ Backend Architect
- 14 modelos de datos diseñados, 35 endpoints, 4 canales WebSocket
- **Stack:** Supabase (Auth + Postgres + Realtime + Edge Functions) + Stripe + Spotify
- **Lo que necesita el frontend:** Definir contratos de API (tipos TypeScript compartidos) antes de integrar
- **Próximo paso:** Crear proyecto Supabase y schema SQL

### 🎨 UI/UX Lead
- 4 componentes nuevos creados (Modal, Toast, EmptyState, BottomSheet)
- **Faltantes críticos:** Skeleton loaders, SwipeableRow, TabBar custom con animación
- **Recomendación:** Crear un hook useTheme para consistencia

### 📋 Product Manager
- **MVP mínimo real en 1 semana:** Auth + crear sesión + cola + votos + chat + búsqueda Spotify
- **North Star:** Canciones pedidas por sesión (target: 5+)
- **Diferenciador:** WhatsApp-first + cola democrática + propinas + no requiere Spotify para oyentes
- **Plan:** Alpha 3 sem → Beta 2 sem → Soft Launch 2 sem → Launch

### 🔧 DevOps
- CI/CD configurado (GitHub Actions), Docker local, PR previews
- **Coste MVP: €0/mes** (todos tiers gratuitos)
- **Recomendación:** Crear repo en GitHub YA y empezar a commitear

### ✍️ Copywriter
- Tagline: "¿Qué suena?"
- Copy completo: App Store, onboarding, landing, posts, notificaciones, estados vacíos
- **Recomendación:** Integrar textos de onboarding y estados vacíos inmediatamente

---

## 3. DECISIONES QUE NECESITAN APROBACIÓN DE ÁNGEL

1. **¿Nombre definitivo WhatsSound?** — El copywriter lo recomienda. Alternativas: SoundParty, TuneIn Live, VibeBox
2. **¿Stack Supabase?** — Backend lo recomienda. Alternativa: Firebase. Supabase = SQL + open source + más barato a escala
3. **¿Priorizar MVP de 1 semana?** — Product dice que con 7 features core (auth, sesión, cola, votos, chat, Spotify, notif) ya hay producto. ¿Vamos a eso o seguimos con todas las pantallas?
4. **¿Crear repo GitHub ahora?** — DevOps lo recomienda para empezar CI/CD
5. **¿Integrar propinas en MVP o dejarlo para v2?** — Product dice Should Have, no Must Have

---

## 4. PRÓXIMOS PASOS RECOMENDADOS (Top 5)

| Prioridad | Acción | Responsable | Tiempo |
|-----------|--------|-------------|--------|
| 1 | Corregir 6 bugs críticos pendientes | Leo / QA | 30 min |
| 2 | Crear tipos TypeScript compartidos (API contracts) | Backend + Leo | 1h |
| 3 | Integrar copy real (onboarding, estados vacíos, notificaciones) | Leo + Copy | 1h |
| 4 | Crear proyecto Supabase + schema SQL | Backend | 2h |
| 5 | Conectar auth real (Supabase Auth + OTP) | Leo + Backend | 3h |

---

## 5. RIESGOS

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Sin backend, todo es maqueta | Alto | Priorizar Supabase en próximo bloque |
| Spotify API requiere aprobación extendida | Alto | Modo simulado mientras tanto (ya diseñado) |
| Sin tests, bugs se acumulan | Medio | Añadir tests básicos con Jest |
| Demasiadas pantallas, pocas conectadas | Medio | Conectar flujos core antes de añadir más |

---

## 6. ESTIMACIÓN PARA MVP FUNCIONAL

| Fase | Tiempo estimado |
|------|----------------|
| Bugs + refactor | 1 sesión (2-3h) |
| Backend + auth | 1-2 sesiones |
| Conectar pantallas core | 1-2 sesiones |
| Integración Spotify (simulado) | 1 sesión |
| Testing + pulido | 1 sesión |
| **Total MVP funcional** | **~5-7 sesiones de trabajo** |

---

*Pendiente: Aprobación de Ángel en las 5 decisiones listadas para continuar.*
