# 08-PREPARACION-EJECUCION.md — Fase 8: Preparación Final y Ejecución

## 🎯 ¿Qué es la Preparación para Ejecución?

Es la fase final del protocolo. Aquí el proyecto deja de ser un MVP local y se prepara para **producción real, usuarios reales y mercado real**. Todo lo que se ha construido con el equipo virtual se traduce en un plan ejecutable.

**Diferencia con Fase 5 (Cierre de Versión):**
- Fase 5: Cerrar una versión estable y limpia
- Fase 8: Preparar ESA versión para el mundo real — producción, lanzamiento, escalado

**⚡ REGLA FUNDAMENTAL:** No se lanza nada sin la aprobación explícita de Ángel. Pero Leo debe tener TODO listo para que cuando Ángel diga "adelante", la ejecución sea inmediata.

## 🔥 Filosofía de Ejecución

1. **Producción ≠ MVP** — El MVP demuestra que funciona. Producción demuestra que funciona *para todos, siempre, a escala*
2. **Prepararse para fallar** — Monitoreo, alertas, rollbacks listos desde día 1
3. **Handoff claro** — Si equipos humanos van a operar esto, el handoff debe ser impecable
4. **Datos > Opiniones** — Post-lanzamiento, las decisiones se basan en datos reales de usuarios
5. **Iterar rápido, romper poco** — Despliegues frecuentes pero controlados

## 📋 Proceso Completo

### ✅ PASO 1: Auditoría Pre-Producción

**Leo convoca a los expertos relevantes para auditar cada área antes de producción.**

**Crear:** `development/production/00-AUDITORIA-PRE-PRODUCCION.md`

```markdown
# Auditoría Pre-Producción - [Proyecto]

## 📅 Fecha: [YYYY-MM-DD]
## 🎯 Versión a producción: [vX.Y.Z]

## 🔍 Checklist por Área

### 1. Código y Calidad
- [ ] Todo el código revisado (no hay TODOs críticos)
- [ ] Tests unitarios cubren funcionalidades core (>80% coverage)
- [ ] Tests de integración pasan consistentemente
- [ ] No hay dependencias con vulnerabilidades conocidas
- [ ] Linting y formatting consistentes
- [ ] Código documentado (funciones complejas comentadas)
- [ ] README del repo actualizado con instrucciones de setup

### 2. Infraestructura y DevOps
- [ ] Entorno de producción configurado y testeado
- [ ] Variables de entorno de producción separadas de dev
- [ ] SSL/HTTPS configurado
- [ ] Dominio(s) configurado(s) y DNS propagado
- [ ] CDN configurado (si aplica)
- [ ] Base de datos en producción migrada y con backup
- [ ] Pipeline de CI/CD funcionando
- [ ] Rollback process documentado y probado

### 3. Seguridad
- [ ] Autenticación robusta (no hay bypass posible)
- [ ] Autorización por roles implementada
- [ ] Datos sensibles encriptados
- [ ] API keys y secrets en variables de entorno (no en código)
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] Input validation en todos los endpoints
- [ ] SQL injection / XSS protegido

### 4. Performance
- [ ] Tiempo de carga < 3 segundos en primera visita
- [ ] API response time < 500ms para operaciones comunes
- [ ] Imágenes optimizadas (WebP, lazy loading)
- [ ] Cache configurado apropiadamente
- [ ] Base de datos con índices necesarios
- [ ] No hay queries N+1 sin resolver
- [ ] Load testing realizado para [N] usuarios concurrentes

### 5. UX / Producto
- [ ] Flujos principales probados end-to-end
- [ ] Flujo de onboarding funciona sin fricción
- [ ] Mensajes de error claros y útiles
- [ ] Estados vacíos diseñados (empty states)
- [ ] Responsive / adaptativo funcionando
- [ ] Accesibilidad básica verificada
- [ ] Copy final revisado (no hay lorem ipsum)

### 6. Legal y Compliance
- [ ] Términos de servicio redactados
- [ ] Política de privacidad publicada
- [ ] Consentimiento de cookies (si aplica)
- [ ] GDPR / LOPD compliance (si aplica)
- [ ] Licencias de terceros revisadas
- [ ] Derechos de contenido verificados (si aplica)

### 7. Monitoreo y Observabilidad
- [ ] Error tracking configurado (Sentry / similar)
- [ ] Logging en producción activo
- [ ] Alertas configuradas para errores críticos
- [ ] Métricas de rendimiento monitorizadas
- [ ] Uptime monitoring activo
- [ ] Dashboard de salud del sistema creado

### 8. Comunicación y Marketing
- [ ] Landing page / Store listing listo
- [ ] Screenshots y descripciones actualizadas
- [ ] Redes sociales preparadas (si aplica)
- [ ] Plan de lanzamiento definido
- [ ] Comunicación a early adopters preparada

## 📊 Resultado de Auditoría

### Por Área
| Área | Items Total | Completados | Bloqueantes | Estado |
|------|-----------|------------|-------------|--------|
| Código | [N] | [N] | [N] | ✅/⚠️/❌ |
| Infraestructura | [N] | [N] | [N] | ✅/⚠️/❌ |
| Seguridad | [N] | [N] | [N] | ✅/⚠️/❌ |
| Performance | [N] | [N] | [N] | ✅/⚠️/❌ |
| UX | [N] | [N] | [N] | ✅/⚠️/❌ |
| Legal | [N] | [N] | [N] | ✅/⚠️/❌ |
| Monitoreo | [N] | [N] | [N] | ✅/⚠️/❌ |
| Comunicación | [N] | [N] | [N] | ✅/⚠️/❌ |

### Bloqueantes para Lanzamiento
[Lista de items que DEBEN resolverse antes de producción]
1. [Bloqueante 1] → [Responsable] → [Deadline]

### No Bloqueantes (resolver post-lanzamiento)
[Lista de items que pueden esperar]
1. [Item] → [Prioridad] → [Sprint post-lanzamiento]

### Veredicto
[LISTO PARA PRODUCCIÓN / NECESITA TRABAJO / BLOQUEADO]
```

### ✅ PASO 2: Preparación para Producción Real

**Todo lo que hay que hacer TÉCNICAMENTE para pasar de local/staging a producción.**

#### 2.1 Plan de Despliegue

**Crear:** `development/production/01-PLAN-DESPLIEGUE.md`

```markdown
# Plan de Despliegue - [Proyecto] v[X.Y.Z]

## 📅 Fecha Planificada de Lanzamiento
[YYYY-MM-DD HH:MM] (zona horaria)

## 🎯 Tipo de Despliegue
[Big Bang / Rolling / Canary / Blue-Green]
Justificación: [Por qué este tipo]

## 📋 Secuencia de Despliegue

### Fase 0: Pre-Despliegue (1 día antes)
- [ ] Backup completo de base de datos
- [ ] Snapshot del estado actual de infraestructura
- [ ] Notificar a beta testers (si los hay)
- [ ] Congelar merges a main/production
- [ ] Verificar que CI/CD está verde
- [ ] Preparar comunicación de lanzamiento

### Fase 1: Infraestructura (2-4 horas antes)
- [ ] Verificar que servidores de producción están saludables
- [ ] Verificar conexiones a servicios externos
- [ ] Configurar feature flags (si aplica)
- [ ] Activar modo mantenimiento (si es migración)

### Fase 2: Despliegue (La Hora)
- [ ] Ejecutar deploy
- [ ] Ejecutar migraciones de base de datos
- [ ] Verificar que el deploy completó sin errores
- [ ] Smoke test manual (flujos críticos)
- [ ] Verificar monitoreo activo y recibiendo datos

### Fase 3: Verificación (30 min post-deploy)
- [ ] Verificar flujos principales end-to-end
- [ ] Verificar que no hay errores en logs
- [ ] Verificar que métricas de rendimiento son normales
- [ ] Verificar que alertas están activas
- [ ] Primer usuario de prueba completa el flujo

### Fase 4: Go Live (si todo OK)
- [ ] Desactivar modo mantenimiento
- [ ] Abrir acceso público
- [ ] Enviar comunicación de lanzamiento
- [ ] Monitorear activamente las primeras 2 horas

## 🔙 Plan de Rollback

### Trigger de Rollback
[Condiciones bajo las cuales hacemos rollback inmediato]
- Error rate > [N]% en primeros 30 minutos
- Tiempo de respuesta > [N] segundos consistentemente
- Funcionalidad core rota (auth, pagos, etc.)
- Data corruption detectada

### Proceso de Rollback
1. [Paso 1: ej. revertir deploy a versión anterior]
2. [Paso 2: ej. restaurar base de datos de backup]
3. [Paso 3: ej. verificar que rollback funciona]
4. [Paso 4: ej. notificar a usuarios afectados]
5. [Paso 5: ej. post-mortem y plan de fix]

### Tiempo Estimado de Rollback
[N minutos] — ya probado en [fecha de prueba]
```

#### 2.2 Para Apps Móviles (Dame un OK, WhatsSound)

```markdown
# Preparación Store - [App]

## 📱 Apple App Store
- [ ] App Store Connect configurado
- [ ] Certificados y provisioning profiles de producción
- [ ] App icons en todos los tamaños necesarios
- [ ] Screenshots para todos los dispositivos requeridos
- [ ] Descripción, keywords y categoría definidos
- [ ] Privacy labels completados
- [ ] App review guidelines revisados (no violar ninguna)
- [ ] TestFlight build aprobada por beta testers
- [ ] Versión final subida y enviada a review

## 🤖 Google Play Store
- [ ] Google Play Console configurado
- [ ] Signing key de producción generada y segura
- [ ] Store listing completo (título, descripción, screenshots)
- [ ] Content rating completado
- [ ] Data safety form completado
- [ ] Internal testing track probado
- [ ] Production release preparado

## ⏱️ Tiempos de Review Esperados
- Apple: 24-48 horas (puede ser más)
- Google: 1-7 días (primera vez suele ser más largo)
- ENVIAR A REVIEW AL MENOS 1 SEMANA ANTES DEL LANZAMIENTO DESEADO
```

### ✅ PASO 3: Handoff a Equipos Humanos

**Si el producto va a ser operado/mantenido por personas reales (no solo Leo), el handoff debe ser perfecto.**

**Crear:** `development/production/02-HANDOFF.md`

```markdown
# Handoff a Equipos Humanos - [Proyecto]

## 📅 Fecha de Handoff: [YYYY-MM-DD]

## 🎯 ¿Quién Recibe Qué?

### Equipo de Operaciones
- **Quién:** [Nombres/roles]
- **Qué recibe:** [Accesos, dashboards, documentación]
- **Responsabilidades:** [Qué deben hacer día a día]
- **Escalación:** [A quién escalan si algo falla]

### Equipo de Soporte al Usuario
- **Quién:** [Nombres/roles]
- **Qué recibe:** [FAQs, guías de troubleshooting, acceso a herramientas]
- **Responsabilidades:** [Atender queries de usuarios]
- **Escalación:** [Cuándo escalar a técnico vs resolver ellos]

### Equipo de Marketing / Growth
- **Quién:** [Nombres/roles]
- **Qué recibe:** [Accesos a analytics, assets de marca, copy guidelines]
- **Responsabilidades:** [Adquisición, retención, comunicación]

## 📚 Documentación de Handoff

### Para Operaciones
1. **Guía de Operación Diaria** — `docs/operations/daily-ops.md`
   - Qué revisar cada mañana
   - Métricas normales vs anormales
   - Acciones ante incidentes comunes

2. **Runbook de Incidentes** — `docs/operations/runbook.md`
   - Problema: [Descripción]
   - Síntomas: [Cómo detectarlo]
   - Solución: [Pasos exactos]
   - Escalación: [Si no se resuelve en N minutos]

3. **Accesos y Credenciales** — (documento seguro, no en repo)
   - Listado de servicios con accesos
   - Quién tiene acceso a qué
   - Proceso para rotar credenciales

### Para Soporte
1. **FAQ de Usuarios** — `docs/support/faq.md`
2. **Guía de Troubleshooting** — `docs/support/troubleshooting.md`
3. **Mensajes Predefinidos** — `docs/support/canned-responses.md`

### Para Marketing
1. **Brand Guidelines** — `assets/brand/guidelines.md`
2. **Copy Guidelines** — `docs/marketing/copy-guide.md`
3. **Analytics Dashboard** — [URL y acceso]

## 🎓 Sesiones de Training

| Sesión | Audiencia | Duración | Contenido | Fecha |
|--------|----------|----------|-----------|-------|
| Ops 101 | Operaciones | 2h | Sistema, monitoreo, incidentes | [Fecha] |
| Support 101 | Soporte | 1h | Producto, FAQ, herramientas | [Fecha] |
| Analytics 101 | Marketing | 1h | Dashboards, métricas, reportes | [Fecha] |

## ✅ Checklist de Handoff Completado
- [ ] Toda la documentación entregada y revisada
- [ ] Accesos configurados para todos los equipos
- [ ] Sesiones de training completadas
- [ ] Periodo de acompañamiento definido (Leo disponible por [N] días)
- [ ] Canal de escalación establecido
- [ ] Cada equipo ha hecho al menos 1 simulacro
```

**Ejemplo Real - Dame un OK:**

```
Handoff principal: Ángel como Product Owner + equipo familiar de soporte
- Ángel recibe: dashboard de monitoreo, analytics, control de users
- Soporte inicial: Ángel + familiar tech-savvy que entiende la app
- Escalación técnica: Leo via Telegram (Vertex Developer)
- Training: 1 sesión de 2h con Ángel recorriendo toda la plataforma
```

### ✅ PASO 4: Checklist de Lanzamiento

**EL DOCUMENTO MÁS IMPORTANTE DE ESTA FASE.**

**Crear:** `development/production/03-LAUNCH-CHECKLIST.md`

```markdown
# 🚀 Launch Checklist - [Proyecto] v[X.Y.Z]

## 📅 Fecha de Lanzamiento: [YYYY-MM-DD]
## 👑 Aprobado por: [Pendiente / Ángel Fernández - fecha]

## Estado General: [🔴 NO LISTO / 🟡 CASI / 🟢 LISTO]

---

## ✅ T-7 días (1 semana antes)

### Producto
- [ ] Auditoría pre-producción completada sin bloqueantes
- [ ] Todas las features del roadmap v2 implementadas
- [ ] Testing end-to-end en entorno staging completo
- [ ] Ángel ha aprobado la versión final del producto

### Infraestructura
- [ ] Entorno de producción replicando staging
- [ ] Monitoreo y alertas configurados
- [ ] Backup automático funcionando
- [ ] SSL y seguridad verificados

### Legal
- [ ] Términos de servicio publicados
- [ ] Política de privacidad publicada
- [ ] Compliance verificado

### Comunicación
- [ ] Plan de lanzamiento aprobado por Ángel
- [ ] Assets de marketing listos
- [ ] Lista de early adopters / beta testers preparada

---

## ✅ T-3 días (3 días antes)

### Técnico
- [ ] Deploy a producción realizado (sin abrir acceso público)
- [ ] Smoke testing en producción completado
- [ ] Rollback probado y funcionando
- [ ] Base de datos de producción con datos seed necesarios

### Stores (si app móvil)
- [ ] Build enviada a Apple Review
- [ ] Build enviada a Google Review
- [ ] Estado de review: [Pendiente / En review / Aprobada]

### Soporte
- [ ] Documentación de soporte lista
- [ ] Canal de soporte operativo
- [ ] FAQ publicada

---

## ✅ T-1 día (día antes)

- [ ] Verificación final de todos los sistemas
- [ ] Comunicación de lanzamiento programada
- [ ] Todo el equipo notificado del plan de mañana
- [ ] Leo disponible para monitoreo en las primeras 24h
- [ ] Ángel informado y listo para dar el GO final

---

## ✅ T-0 (Día de Lanzamiento)

### Hora H-2 (2 horas antes)
- [ ] Última verificación de salud del sistema
- [ ] Monitoreo en modo alerta
- [ ] Equipo en standby

### Hora H (Lanzamiento)
- [ ] GO de Ángel recibido: "________" (registrar palabras exactas)
- [ ] Acceso público activado
- [ ] Comunicación de lanzamiento enviada
- [ ] Primer usuario real verificado

### Hora H+1
- [ ] Métricas de primera hora revisadas
- [ ] Error rate < [N]%: ✅/❌
- [ ] Funcionalidades core operativas: ✅/❌
- [ ] Primer feedback de usuario: [Positivo/Negativo/Neutro]

### Hora H+4
- [ ] Sin incidentes críticos: ✅/❌
- [ ] [N] usuarios registrados
- [ ] Performance estable: ✅/❌

### Hora H+24 (Día 1 completado)
- [ ] Reporte de primer día creado
- [ ] Incidentes documentados (si los hubo)
- [ ] Primer batch de feedback recopilado
- [ ] Decisión: ¿Continuar / Pausar / Rollback?

---

## 📊 Métricas de Lanzamiento Objetivo

| Métrica | Target Día 1 | Target Semana 1 | Target Mes 1 |
|---------|-------------|-----------------|--------------|
| Usuarios registrados | [N] | [N] | [N] |
| Usuarios activos | [N] | [N] | [N] |
| Error rate | <[N]% | <[N]% | <[N]% |
| Retención D1 | [N]% | - | - |
| Retención D7 | - | [N]% | - |
| NPS / Satisfacción | - | [N] | [N] |
```

### ✅ PASO 5: Monitoreo Post-Lanzamiento

**Los primeros 30 días post-lanzamiento son CRÍTICOS.**

**Crear:** `development/production/04-POST-LAUNCH-MONITORING.md`

```markdown
# Monitoreo Post-Lanzamiento - [Proyecto]

## 📅 Fecha de Lanzamiento: [YYYY-MM-DD]

## 📊 Dashboard de Salud

### Métricas Técnicas (revisar DIARIAMENTE)
| Métrica | Normal | Warning | Crítico | Actual |
|---------|--------|---------|---------|--------|
| Uptime | >99.5% | 99-99.5% | <99% | [%] |
| Error rate | <1% | 1-5% | >5% | [%] |
| Response time (P95) | <500ms | 500-2000ms | >2s | [ms] |
| Memory usage | <70% | 70-90% | >90% | [%] |
| DB connections | <80% pool | 80-95% | >95% | [N] |

### Métricas de Producto (revisar DIARIAMENTE)
| Métrica | Día | Semana | Tendencia |
|---------|-----|--------|-----------|
| Nuevos registros | [N] | [N] | [↑↓→] |
| DAU (usuarios activos diarios) | [N] | - | [↑↓→] |
| WAU (usuarios activos semanales) | - | [N] | [↑↓→] |
| Sesión promedio (minutos) | [N] | [N] | [↑↓→] |
| Feature más usada | [Nombre] | [Nombre] | - |
| Feature menos usada | [Nombre] | [Nombre] | - |

### Métricas de Engagement (revisar SEMANALMENTE)
| Métrica | Semana 1 | Semana 2 | Semana 3 | Semana 4 |
|---------|---------|---------|---------|---------|
| Retención D1 | [%] | [%] | [%] | [%] |
| Retención D7 | [%] | [%] | [%] | [%] |
| Retención D30 | - | - | - | [%] |
| Churn rate | [%] | [%] | [%] | [%] |

## 📋 Rutina de Monitoreo

### Diaria (Leo + sistema automático)
- 09:00 — Revisar dashboard de salud técnica
- 09:15 — Revisar errores nuevos en Sentry/logs
- 09:30 — Revisar métricas de producto del día anterior
- 17:00 — Resumen diario a Ángel (si hay algo relevante)

### Semanal (Leo + Ángel)
- Reporte semanal de métricas
- Top 5 issues reportados por usuarios
- Top 3 features solicitadas
- Decisiones de priorización

### Mensual (Equipo completo)
- Revisión de KPIs vs objetivos
- Análisis de cohortes
- Planificación de siguiente iteración
- Decisión de escalado

## 🚨 Protocolo de Incidentes

### Severidad 1 - Crítico (respuesta inmediata)
**Criterio:** Sistema caído, data loss, seguridad comprometida
- **Respuesta:** Leo actúa inmediatamente
- **Comunicación:** Notificar a Ángel en <15 minutos
- **Resolución target:** <1 hora
- **Post-mortem:** Obligatorio en 24 horas

### Severidad 2 - Alto (respuesta en <2 horas)
**Criterio:** Feature core roto, performance degradado >50%
- **Respuesta:** Leo investiga y propone fix
- **Comunicación:** Notificar a Ángel en resumen diario
- **Resolución target:** <4 horas
- **Post-mortem:** Recomendado

### Severidad 3 - Medio (respuesta en <24 horas)
**Criterio:** Bug visible, feature secundario roto
- **Respuesta:** Añadir a backlog con prioridad
- **Comunicación:** Incluir en reporte semanal
- **Resolución target:** <1 semana

### Severidad 4 - Bajo (backlog)
**Criterio:** Cosmético, edge case, mejora menor
- **Respuesta:** Backlog para próxima iteración
- **Comunicación:** No necesaria salvo que se acumule

### Template de Post-Mortem
```markdown
# Post-Mortem - Incidente [Nombre/ID]

## 📅 Fecha: [YYYY-MM-DD HH:MM]
## 🚨 Severidad: [1/2/3/4]
## ⏱️ Duración: [Inicio - Resolución]

## ¿Qué pasó?
[Descripción factual del incidente]

## ¿Qué impacto tuvo?
- Usuarios afectados: [N]
- Funcionalidad afectada: [Cuál]
- Duración del impacto: [Tiempo]

## Timeline
- [HH:MM] — [Evento]
- [HH:MM] — [Acción tomada]
- [HH:MM] — [Resolución]

## Root Cause
[Causa raíz del problema]

## ¿Cómo se resolvió?
[Pasos de resolución]

## ¿Cómo prevenirlo?
- [Acción preventiva 1]
- [Acción preventiva 2]

## Action Items
| Acción | Responsable | Deadline | Estado |
|--------|------------|----------|--------|
| [Acción] | [Quién] | [Fecha] | [Pendiente/Hecho] |
```
```

### ✅ PASO 6: Iteración Basada en Datos Reales

**Los primeros 30 días generan datos REALES. Es el momento de iterar con inteligencia.**

**Crear:** `development/production/05-ITERACION-POST-LAUNCH.md`

```markdown
# Plan de Iteración Post-Lanzamiento - [Proyecto]

## 📊 Fuentes de Datos para Decisiones

### 1. Analytics de Producto
- Qué features se usan más / menos
- Dónde abandonan los usuarios los flujos
- Tiempo en cada pantalla/sección
- Patrones de uso (horarios, frecuencia)

### 2. Feedback Directo de Usuarios
- Reviews en App Store / Play Store
- Mensajes de soporte
- Encuestas in-app (NPS, satisfacción)
- Entrevistas con usuarios clave

### 3. Métricas de Negocio
- Costo de adquisición de usuario (CAC)
- Lifetime value (LTV)
- Conversión free → premium (si aplica)
- Revenue por usuario (ARPU)

### 4. Métricas Técnicas
- Errores más frecuentes
- Dispositivos / OS con problemas
- Performance por región geográfica
- Uso de recursos del servidor

## 🎯 Framework de Priorización

### Matriz Impacto vs Esfuerzo

|  | Bajo Esfuerzo | Alto Esfuerzo |
|--|--------------|--------------|
| **Alto Impacto** | 🔥 HACER YA | 📅 PLANIFICAR |
| **Bajo Impacto** | ✅ QUICK WIN | ❌ IGNORAR |

### Criterios de Priorización
1. **¿Afecta retención?** — Si los usuarios se van por esto, es prioridad 1
2. **¿Bloquea crecimiento?** — Si no podemos escalar sin esto, es prioridad 2
3. **¿Lo piden muchos usuarios?** — Volumen de solicitudes importa
4. **¿Tiene impacto en revenue?** — Si afecta dinero, sube de prioridad
5. **¿Es un quick win?** — Si es fácil y mejora algo, hacerlo ya

## 📋 Ciclo de Iteración Post-Launch

### Semana 1-2: Estabilización
- **Foco:** Bugs, performance, incidentes
- **No hacer:** Features nuevas
- **Output:** Versión estable v[X.Y.1]

### Semana 3-4: Primeras Mejoras
- **Foco:** Quick wins basados en datos de las primeras 2 semanas
- **Datos clave:** Dónde abandonan, qué no usan, qué piden
- **Output:** Versión mejorada v[X.Y.2]

### Mes 2: Iteración Informada
- **Foco:** Features nuevas basadas en datos de mes 1
- **Datos clave:** Retención, engagement, feedback cualitativo
- **Output:** Versión v[X.(Y+1).0] con nuevas features

### Mes 3+: Crecimiento
- **Foco:** Escalado, optimización, nuevos mercados
- **Datos clave:** Unit economics, product-market fit metrics
- **Output:** Plan de escalado
```

### ✅ PASO 7: Escalado del Producto

**Cuando el producto funciona y tiene tracción, es momento de escalar.**

**Crear:** `development/production/06-PLAN-ESCALADO.md`

```markdown
# Plan de Escalado - [Proyecto]

## 📊 Criterios para Escalar
[No escalar hasta que se cumplan TODOS estos criterios]

### Product-Market Fit
- [ ] Retención D30 > [N]% (usuarios vuelven)
- [ ] NPS > [N] (usuarios recomiendan)
- [ ] Crecimiento orgánico > [N]% mensual (word of mouth)
- [ ] Feature core usada por > [N]% de usuarios activos

### Estabilidad Técnica
- [ ] Uptime > 99.5% durante último mes
- [ ] Error rate < 1% estable
- [ ] No hay incidentes S1/S2 en último mes
- [ ] Infraestructura soporta [N]x usuarios actuales

### Negocio
- [ ] Unit economics positivos (o camino claro a ellos)
- [ ] Ángel aprueba inversión en escalado
- [ ] Recursos (dinero/tiempo) disponibles

## 🚀 Estrategias de Escalado

### Escalado Técnico
1. **Horizontal:** Más servidores / workers / instancias
2. **Vertical:** Más recursos por servidor
3. **Optimización:** Cache, CDN, query optimization
4. **Arquitectura:** Migrar a microservicios si monolito no escala

### Escalado de Producto
1. **Nuevas features:** Basadas en datos reales de usuarios
2. **Nuevos mercados:** Geografías, idiomas, segmentos
3. **Nuevos canales:** Web si solo era móvil, móvil si solo era web
4. **Integraciones:** Con otros productos/servicios del ecosistema

### Escalado de Equipo
1. **Ampliar equipo virtual:** Volver a Fase 6 si necesitamos más expertise
2. **Contratar humanos:** Si el volumen requiere personas reales
3. **Partnerships:** Alianzas estratégicas con otras empresas
4. **Automatización:** Reemplazar procesos manuales con sistemas

### Escalado de Negocio
1. **Monetización:** Implementar/optimizar modelo de revenue
2. **Marketing:** Invertir en adquisición pagada
3. **Ventas:** Si es B2B, establecer proceso de ventas
4. **Internacionalización:** Localización y expansión geográfica

## 📋 Roadmap de Escalado

| Fase | Objetivo | Métrica Clave | Timeline |
|------|---------|--------------|---------|
| Escala 1 | [N] → [N] usuarios | [Métrica] | [Meses] |
| Escala 2 | [N] → [N] usuarios | [Métrica] | [Meses] |
| Escala 3 | [N] → [N] usuarios | [Métrica] | [Meses] |

## 💰 Recursos Necesarios para Escalar

| Recurso | Costo Estimado | Justificación |
|---------|---------------|---------------|
| [Infra] | [€/mes] | [Por qué] |
| [Marketing] | [€/mes] | [Por qué] |
| [Personas] | [€/mes] | [Por qué] |
| **Total** | **[€/mes]** | |
```

**Ejemplo Real - Dame un OK:**

```
Escalado planificado:
- Escala 1 (Mes 1-3): 50 → 500 familias (growth orgánico, redes de mayores)
- Escala 2 (Mes 3-6): 500 → 5000 familias (partnerships con residencias/centros de día)
- Escala 3 (Mes 6-12): 5000 → 50000 familias (marketing pagado + internacionalización)

Inversión necesaria:
- Infra: €50/mes → €200/mes → €500/mes (Supabase Pro + Vercel Pro)
- Marketing: €0 → €500/mes → €2000/mes
- Soporte: Ángel → 1 persona part-time → equipo de 3
```

## 📁 Estructura de Carpetas Final

```
development/
├── code/                              # Código del proyecto
├── tests/                             # Tests
├── iterations/                        # Historial de iteraciones
├── demos/                             # Demos para Ángel
└── production/                        # ESTA FASE
    ├── 00-AUDITORIA-PRE-PRODUCCION.md
    ├── 01-PLAN-DESPLIEGUE.md
    ├── 02-HANDOFF.md
    ├── 03-LAUNCH-CHECKLIST.md
    ├── 04-POST-LAUNCH-MONITORING.md
    ├── 05-ITERACION-POST-LAUNCH.md
    ├── 06-PLAN-ESCALADO.md
    ├── incidents/
    │   ├── post-mortem-001.md
    │   └── ...
    ├── reports/
    │   ├── daily/
    │   │   └── YYYY-MM-DD.md
    │   ├── weekly/
    │   │   └── semana-NN.md
    │   └── monthly/
    │       └── mes-NN.md
    └── data/
        ├── user-feedback/
        ├── analytics-snapshots/
        └── ab-tests/
```

## ⚠️ Errores Comunes en Preparación y Ejecución

### ❌ NO hacer:
- **Lanzar sin monitoreo** — Si no puedes ver qué pasa en producción, no lances
- **Ignorar el rollback** — Si no sabes cómo revertir, no despliegues
- **Lanzar en viernes** — Regla universal: nunca desplegar antes de fin de semana
- **Escalar antes de tener product-market fit** — Escalar algo que nadie quiere es tirar dinero
- **No documentar incidentes** — Cada incidente sin post-mortem se repetirá
- **Ignorar feedback de usuarios** — Son la fuente de verdad más valiosa
- **Hacer handoff sin training** — Documentación sin sesión de training es inútil
- **Optimizar prematuramente** — Primero que funcione, luego que escale
- **No tener plan de iteración** — El lanzamiento no es el final, es el principio

### ✅ SÍ hacer:
- **Auditar obsesivamente antes de producción** — Cada checkbox importa
- **Tener rollback probado** — No solo documentado, PROBADO
- **Monitorear activamente los primeros 30 días** — Como un padre primerizo
- **Iterar basándose en datos** — No en intuición ni en opiniones
- **Comunicar a Ángel regularmente** — Resumen diario la primera semana, semanal después
- **Celebrar el lanzamiento** — Es un hito importante, hay que reconocerlo
- **Planificar el escalado desde el principio** — No como emergencia sino como evolución natural
- **Mantener al equipo virtual activo post-launch** — Los expertos siguen siendo útiles para iteración

## 🎯 Output de Preparación y Ejecución

Al finalizar esta fase, tendremos:

### 📁 Estructura completa
```
development/production/ ✅
├── 00-AUDITORIA-PRE-PRODUCCION.md ✅
├── 01-PLAN-DESPLIEGUE.md ✅
├── 02-HANDOFF.md ✅ (si aplica)
├── 03-LAUNCH-CHECKLIST.md ✅
├── 04-POST-LAUNCH-MONITORING.md ✅
├── 05-ITERACION-POST-LAUNCH.md ✅
├── 06-PLAN-ESCALADO.md ✅
├── incidents/ ✅ (vacío al principio, se llena con el tiempo)
├── reports/ ✅ (se genera diaria/semanal/mensualmente)
└── data/ ✅ (feedback, analytics, AB tests)
```

### 📋 Documentos clave
- ✅ Auditoría pre-producción completada sin bloqueantes
- ✅ Plan de despliegue documentado con rollback probado
- ✅ Handoff a equipos humanos completado (si aplica)
- ✅ Launch checklist al 100%
- ✅ Monitoreo post-lanzamiento configurado y operativo
- ✅ Plan de iteración basado en datos definido
- ✅ Plan de escalado preparado para cuando haya tracción

### 🚀 Estado del proyecto
**EN PRODUCCIÓN — MONITOREO ACTIVO — ITERANDO**

---

## 🏆 ¡PROTOCOLO COMPLETO!

Si has llegado hasta aquí, el proyecto ha pasado por todas las fases:

1. ✅ **Genesis** — Idea capturada y estructurada
2. ✅ **Creación de Equipo** — Superexpertos virtuales basados en referentes reales
3. ✅ **Reuniones Iniciales** — Roadmap definido con el equipo
4. ✅ **Desarrollo** — MVP construido e iterado
5. ✅ **Cierre de Versión** — Versión estable y documentada
6. ✅ **Ampliación de Equipo** — Expertise expandido según necesidad
7. ✅ **Reuniones Ampliadas** — Equipo completo alineado
8. ✅ **Preparación y Ejecución** — En producción, iterando con datos reales

**El ciclo no termina aquí.** Después de la Fase 8, el proyecto puede volver a cualquier fase anterior:
- ¿Necesitas más expertise? → Fase 6
- ¿Hay que replantear el producto? → Fase 1
- ¿Nueva versión mayor? → Fase 4
- ¿Escalar masivamente? → Fase 8 de nuevo con mayores ambiciones

**El protocolo es un ciclo, no una línea recta.**

---

🎯 **Vertex Developer — Ángel Fernández + Leo AI — Equipos Virtuales de Superexpertos**