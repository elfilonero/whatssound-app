# 04-DESARROLLO.md — Fase 4: Desarrollo del MVP

## 🎯 ¿Qué es la Fase de Desarrollo?

La ejecución práctica donde convertimos el roadmap y decisiones del equipo virtual en un producto real y funcional. Todo el conocimiento absorbido se materializa en código, diseños, procesos o prototipos.

**Regla de Oro:** Desarrollar → Mostrar a Ángel → Recibir Feedback → Iterar. Ciclos cortos, documentación obsesiva, todo en LOCAL hasta aprobación.

## 🔥 Filosofía del Desarrollo

1. **Iteración rápida** - Ciclos de 3-5 días máximo
2. **Feedback temprano** - Ángel ve progreso constantemente  
3. **Documentación como código** - Cada decisión se registra
4. **Testing desde día 1** - No hay excusas para bugs básicos
5. **Local first** - NADA se sube hasta aprobación explícita
6. **Equipo virtual activo** - Los expertos "supervisan" cada área

## 📋 Estructura del Desarrollo

### 🏗️ Setup Inicial del Proyecto

**ANTES de escribir la primera línea de código:**

#### Crear estructura de desarrollo completa

```bash
# En la carpeta del proyecto
mkdir development/{code,tests,iterations,demos,docs}
mkdir development/code/{src,assets,config,scripts}
mkdir development/tests/{unit,integration,e2e,manual}
mkdir development/iterations/{sprint-01,sprint-02,sprint-03}
mkdir development/demos/{week-01,week-02,week-03}
mkdir development/docs/{architecture,api,deployment,troubleshooting}
```

#### Documento base de desarrollo

**Crear:** `development/00-SETUP-DESARROLLO.md`

```markdown
# Setup de Desarrollo - [Proyecto]

## 📊 Información Base
- **Proyecto:** [Nombre]
- **Stack aprobado:** [Tecnologías finales de reuniones]
- **Timeline MVP:** [Duración total]
- **Deadline para Ángel:** [Fecha de entrega]

## 🛠️ Stack Tecnológico Final
### [Categoría 1 - ej: Frontend]
- **Tecnología:** [Ej: Next.js]
- **Versión:** [Ej: 14.1.0]
- **Por qué:** [Decisión del equipo especializado]
- **Experto responsable:** [Nombre del superexperto]

### [Categoría 2 - ej: Backend]
- **Tecnología:** [Ej: Node.js + Express]  
- **Versión:** [Ej: 20.11.0]
- **Por qué:** [Justificación técnica]
- **Experto responsable:** [Nombre del superexperto]

[Completar para todo el stack]

## 🏗️ Arquitectura de Desarrollo

### Estructura de Carpetas
```
[Mostrar estructura específica según proyecto]
```

### Convenciones de Código
- **Naming:** [camelCase/kebab-case/etc]
- **Componentes:** [Convención específica]
- **Variables:** [Estándar establecido]
- **Funciones:** [Formato acordado]

### Git Strategy
- **Branching:** [main/develop/feature approach]
- **Commits:** [Conventional commits/custom format]
- **Tags:** [Versionado semántico]

## 🧪 Testing Strategy
- **Unit tests:** [Framework y approach]
- **Integration tests:** [Herramientas]
- **E2E tests:** [Metodología]
- **Manual testing:** [Checklist approach]

## 📦 Deployment Strategy (Local)
- **Desarrollo:** [Cómo correr localmente]
- **Staging:** [Environment de pruebas]
- **Build:** [Proceso de construcción]
- **Demos:** [Cómo preparar demos para Ángel]

## 👥 Supervisión de Expertos
### [Experto 1] supervisa:
- [Área específica de código/diseño]
- [Revisar en cada iteración]

### [Experto 2] supervisa:
- [Su área de responsabilidad]
- [Criterios de calidad]

[Lista completa de expertos y sus áreas]
```

### ✅ PASO 1: Desarrollo por Iteraciones

**Metodología:** Sprints de 3-5 días con entrega a Ángel al final de cada uno.

#### 1.1 Planificación de Sprint

**Por cada sprint, crear:** `development/iterations/sprint-[XX]/00-planificacion.md`

```markdown
# Sprint [XX] - [Nombre/Objetivo]

## 📅 Fechas
- **Inicio:** [Fecha]
- **Demo a Ángel:** [Fecha]
- **Duración:** [Días]

## 🎯 Objetivo del Sprint
[1-2 frases describiendo qué queremos lograr]

## 📋 Features a Desarrollar
### Feature 1: [Nombre]
- **Descripción:** [Qué hace exactamente]
- **Experto supervisor:** [Quién supervisa la calidad]
- **Criterios de aceptación:**
  - [ ] [Criterio específico 1]
  - [ ] [Criterio específico 2]  
  - [ ] [Criterio específico 3]
- **Estimación:** [Horas/días]

### Feature 2: [Siguiente feature]
[Misma estructura]

## 🧪 Testing Plan
- [ ] [Test específico 1]
- [ ] [Test específico 2]
- [ ] [Test de integración]
- [ ] [Test manual con Ángel]

## 📱 Demo Preparada
**Qué mostraremos a Ángel:**
- [Funcionalidad 1 funcionando]
- [Funcionalidad 2 con datos reales]
- [Flujo completo de usuario]

**Formato de demo:**
- [ ] Video grabado (backup)
- [ ] Demo en vivo
- [ ] Capturas de pantalla  
- [ ] Métricas si aplica

## ⚠️ Riesgos del Sprint
- **[Riesgo 1]:** [Mitigación]
- **[Riesgo 2]:** [Plan B]

## 🔗 Dependencias
- **Del sprint anterior:** [Qué necesitamos terminado]
- **Para próximo sprint:** [Qué debemos entregar]
- **Externas:** [APIs, servicios, datos]
```

#### 1.2 Desarrollo Diario

**Cada día de desarrollo, crear:** `development/iterations/sprint-[XX]/dia-[X]-log.md`

```markdown
# Log Día [X] - Sprint [XX]

## ✅ Trabajo Realizado
### Feature [Nombre]
- **Progreso:** [% completado]
- **Código escrito:** [Descripción de componentes/funciones]
- **Tests añadidos:** [Qué testing se hizo]
- **Bugs encontrados:** [Issues y resoluciones]

### Consulta a Expertos
#### Consulta a [Experto]
- **Pregunta:** [Qué consultamos]
- **Respuesta:** [Qué recomendó basado en su conocimiento]  
- **Aplicación:** [Cómo implementamos la recomendación]

**Ejemplo Real - Dame un OK día 3:**
```markdown
#### Consulta a Dr. Elena Martín (UX para Mayores)
- **Pregunta:** ¿Cómo debe verse el botón de emergencia en la app?
- **Respuesta:** Basándose en estudios de Don Norman sobre affordances para seniors: botón rojo grande (min 44px), texto claro "EMERGENCIA", posición fija top-right, nunca usar iconos solos.
- **Aplicación:** Creamos componente EmergencyButton con estas specs exactas.
```

## 📊 Estado del Sprint
- **Features completadas:** [Lista]
- **Features en progreso:** [Lista]  
- **Blockers actuales:** [Impedimentos]
- **Timeline:** [On track/delayed/ahead]

## 🔄 Próximo día
- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Revisión con experto X]

---
**Total horas día:** [Tiempo invertido]
```

#### 1.3 Final de Sprint - Demo y Retrospectiva

**Crear:** `development/iterations/sprint-[XX]/99-cierre-sprint.md`

```markdown
# Cierre Sprint [XX] - [Nombre]

## 📊 Métricas del Sprint
- **Features planificadas:** [X]
- **Features completadas:** [Y]  
- **Features parciales:** [Z]
- **Bugs encontrados:** [N]
- **Bugs resueltos:** [M]
- **Test coverage:** [%]

## ✅ Features Entregadas
### [Feature 1] - ✅ COMPLETADA
- **Funcionalidad:** [Qué hace]
- **Demo:** [Link a video/capturas]
- **Tests:** [% cobertura]
- **Feedback del experto:** [Validación del área]

### [Feature 2] - ⚠️ PARCIAL  
- **Completado:** [Qué funciona]
- **Pendiente:** [Qué falta]
- **Razón:** [Por qué no se terminó]
- **Plan:** [Cuándo se completará]

## 🎬 Demo para Ángel
### Preparación
- **Fecha/hora:** [Cuándo se mostró]
- **Duración:** [Tiempo de demo]
- **Formato:** [Live/video/screenshots]

### Lo que se mostró
1. **[Funcionalidad 1]:** [Descripción de lo demostrado]
2. **[Funcionalidad 2]:** [Otro aspecto mostrado]
3. **[Flujo completo]:** [User journey de principio a fin]

### Feedback de Ángel
#### ✅ Lo que le gustó
- [Comentario positivo 1]
- [Comentario positivo 2]

#### 💭 Sugerencias
- **[Sugerencia 1]:** [Explicación] - **Prioridad:** Alta/Media/Baja
- **[Sugerencia 2]:** [Explicación] - **Prioridad:** Alta/Media/Baja

#### ❌ Lo que hay que cambiar
- **[Cambio 1]:** [Qué hay que modificar] - **Para cuándo:** [Timeline]
- **[Cambio 2]:** [Otra modificación] - **Para cuándo:** [Timeline]

#### ✅ Aprobación
- **Estado:** [Aprobado/Con cambios/Rechazado]
- **Quote literal:** "[Lo que dijo Ángel textualmente]"

## 🔄 Retrospectiva del Sprint
### ✅ Qué funcionó bien
- [Aspecto positivo 1]
- [Aspecto positivo 2]

### ❌ Qué puede mejorar  
- **[Problema 1]:** [Explicación] → [Plan de mejora]
- **[Problema 2]:** [Explicación] → [Plan de mejora]

### 🎯 Aprendizajes clave
- **Técnicos:** [Qué aprendimos sobre el stack]
- **De proceso:** [Qué optimizar en próximos sprints]
- **Del dominio:** [Qué entendimos mejor del problema]

## 🚀 Próximo Sprint
- **Prioridad #1:** [Qué atacar primero]
- **Cambios a aplicar:** [Modificaciones del feedback]
- **Features nuevas:** [Qué desarrollar]

---
**Sprint Rating:** ⭐⭐⭐⭐⭐ ([razón de la puntuación])
```

### ✅ PASO 2: Documentación Técnica Continua

**Mientras desarrollamos, mantener actualizado:**

#### 2.1 Arquitectura en Vivo

**Crear/actualizar:** `development/docs/architecture/sistema-actual.md`

```markdown
# Arquitectura Actual - [Proyecto]

## 🏗️ Diagrama de Componentes
[Descripción textual de cómo se conecta todo]

### Frontend
- **Componentes principales:** [Lista]
- **Estado:** [Cómo se maneja - Redux/Context/etc]
- **Routing:** [Estructura de navegación]
- **Styling:** [Sistema de estilos]

### Backend (si aplica)
- **API endpoints:** [Lista principal]
- **Base de datos:** [Esquema básico]
- **Servicios externos:** [Integraciones]
- **Auth:** [Sistema de autenticación]

### Integración
- **Flow de datos:** [Cómo fluye la información]  
- **Error handling:** [Manejo de errores]
- **Performance:** [Optimizaciones aplicadas]

## 🔌 APIs y Servicios
### Externos
- **[Servicio 1]:** [Qué usamos] - **Docs:** [Link]
- **[Servicio 2]:** [Para qué lo usamos] - **Config:** [Detalles]

### Internos  
- **[Endpoint 1]:** `[METHOD] /path` - [Descripción]
- **[Endpoint 2]:** `[METHOD] /path` - [Qué devuelve]

## 📱 Dispositivos y Compatibilidad  
- **Web:** [Navegadores soportados]
- **Móvil:** [Versiones de iOS/Android]
- **Desktop:** [Plataformas si aplica]

---
**Última actualización:** [Fecha] - **Sprint:** [Número]
```

#### 2.2 Manual de Troubleshooting

**Crear:** `development/docs/troubleshooting/problemas-comunes.md`

```markdown
# Problemas Comunes y Soluciones

## 🐛 Bugs Frecuentes

### [Nombre del Bug]
- **Síntoma:** [Cómo se manifiesta]
- **Causa:** [Por qué ocurre]  
- **Solución:** [Cómo arreglarlo]
- **Prevención:** [Cómo evitarlo en el futuro]

### Error de [Sistema/Componente]
[Misma estructura]

## ⚙️ Problemas de Setup

### Entorno de desarrollo no arranca
- **Check 1:** [Verificación]
- **Check 2:** [Otra verificación]
- **Solución común:** [Comandos a ejecutar]

### Dependencies issues
[Soluciones para problemas de dependencias]

## 🔧 Performance Issues

### App lenta en [situación]
- **Profiling:** [Cómo diagnosticar]
- **Optimización:** [Qué mejorar]
- **Monitoring:** [Cómo monitorear]

---
**Mantenido por:** Leo AI
**Última actualización:** [Fecha]
```

### ✅ PASO 3: Testing y Calidad Continua

#### 3.1 Testing por Sprint

**En cada sprint, ejecutar:**

```bash
# Testing checklist por sprint
## Unit Tests
- [ ] Todos los componentes nuevos tienen tests
- [ ] Coverage mínimo 80% en funciones críticas  
- [ ] Tests pasan en local

## Integration Tests  
- [ ] APIs integradas funcionan
- [ ] Flow de datos completo funciona
- [ ] Error handling funciona

## Manual Testing
- [ ] Happy path funciona
- [ ] Edge cases funcionan
- [ ] UX es intuitiva (feedback de Ángel)
```

#### 3.2 Quality Gates

**Antes de cada demo a Ángel:**

```markdown
# Quality Gate - Sprint [XX]

## ✅ Criteria DEBE estar verde
- [ ] **No breaking bugs** - App no crashea en happy path
- [ ] **Core functionality works** - Feature principal funciona  
- [ ] **Responsive** - Se ve bien en dispositivos objetivo
- [ ] **Performance** - No lag notorio en acciones principales
- [ ] **Data integrity** - No se pierden datos importantes

## ⚠️ Criteria SHOULD estar verde  
- [ ] **Edge cases handled** - Casos límite gestionados gracefully
- [ ] **Error messages clear** - Mensajes de error útiles
- [ ] **Loading states** - Estados de carga implementados  
- [ ] **Accessibility basics** - Navegación por teclado funciona

## 📊 Métricas de Calidad
- **Unit test coverage:** [X%]
- **Build time:** [X segundos]
- **Bundle size:** [X MB]
- **Performance score:** [X/100]

## 🎯 Aprobación para Demo
**Estado:** ✅ APROBADO / ❌ NECESITA TRABAJO
**Responsable:** Leo AI
**Fecha:** [Timestamp]
```

### ✅ PASO 4: Gestión de Feedback de Ángel

#### 4.1 Captura de Feedback

**Después de cada demo, crear:** `development/iterations/sprint-[XX]/feedback-angel.md`

```markdown
# Feedback Ángel - Sprint [XX]

## 📅 Info de la Session
- **Fecha:** [Timestamp]
- **Duración:** [Minutos]
- **Formato:** [Live demo/video/screenshots]

## 💬 Transcripción de Comentarios
### Feedback Positivo
> "[Quote exacto de lo que dijo positivo]"

> "[Otro comentario que le gustó]"

### Sugerencias y Cambios  
> "[Quote exacto de sugerencia 1]"
**Interpretación:** [Lo que entendimos que quiere]
**Prioridad:** [Alta/Media/Baja según su énfasis]

> "[Quote exacto de sugerencia 2]"
**Interpretación:** [Nuestra interpretación]
**Prioridad:** [Evaluación]

### Decisiones Tomadas en la Reunión
1. **[Decisión 1]:** [Qué se decidió] - **Para cuándo:** [Timeline]
2. **[Decisión 2]:** [Otra decisión] - **Owner:** [Quién lo hará]

## 🎯 Action Items
- [ ] [Acción específica 1] - **Deadline:** [Fecha] - **Sprint:** [Cuál]
- [ ] [Acción específica 2] - **Deadline:** [Fecha] - **Sprint:** [Cuál]

## 📊 Impacto en Roadmap
### Cambios al Sprint Actual
- [Modificación 1]
- [Modificación 2]

### Cambios a Sprints Futuros  
- [Impacto en sprint siguiente]
- [Feature nueva que hay que añadir]

## ✅ Próximo Demo
- **Fecha acordada:** [Cuándo]
- **Qué mostraremos:** [Features a demostrar]
- **Expectativas:** [Qué espera ver Ángel]

---
**Estado general:** [Satisfecho/Con reservas/Necesita cambios mayores]
**Confianza en dirección:** [Alta/Media/Baja]
```

#### 4.2 Implementación de Cambios

**Para cada change request importante:**

```markdown
# Change Request [ID] - [Descripción Breve]

## 📝 Request Original
**Feedback de Ángel:** [Quote exacto]
**Contexto:** [En qué demo/situación surgió]

## 🎯 Interpretación
**Lo que entendemos que quiere:**
[Descripción detallada del cambio solicitado]

**Por qué es importante:**
[Justificación desde perspectiva de Ángel]

## 🛠️ Plan de Implementación
### Opción A: [Approach 1]
- **Pros:** [Ventajas]
- **Cons:** [Desventajas]  
- **Tiempo:** [Estimación]
- **Riesgo:** [Nivel de riesgo]

### Opción B: [Approach 2]
- **Pros:** [Ventajas]
- **Cons:** [Desventajas]
- **Tiempo:** [Estimación]  
- **Riesgo:** [Nivel de riesgo]

**Recomendación del equipo:** [Cuál elegimos y por qué]

## 💻 Implementación
[Detalles técnicos de cómo se implementó]

## ✅ Validación  
- [ ] Implementado según specs
- [ ] Testado manualmente
- [ ] No rompe funcionalidad existente
- [ ] Listo para próxima demo

---
**Status:** [Pending/In Progress/Completed]
**Assigned Sprint:** [Número]
```

## 🎯 Casos Reales de Desarrollo

### 🛡️ Dame un OK - Sprints de Desarrollo

**Sprint 1 (3 días): Setup + Pantalla principal**
- **Entregado:** App básica con botón de emergencia funcional
- **Feedback Ángel:** "Muy bien pero el botón es pequeño"
- **Change:** Botón de 60px → 80px, color rojo más intenso

**Sprint 2 (4 días): Geolocalización**
- **Entregado:** Tracking GPS con mapa en tiempo real
- **Feedback Ángel:** "Perfecto pero necesita funcionar sin internet"
- **Change:** Implementar cache local + sync cuando vuelve conexión

**Sprint 3 (5 días): Dashboard familias**  
- **Entregado:** Web dashboard con alertas en tiempo real
- **Feedback Ángel:** "Notificaciones por email también"
- **Change:** Integrar SendGrid para notificaciones automáticas

### 🎵 WhatsSound - Desarrollo con Referencia Cruzada

**Sprint 1: Core social + aprovechamiento Dame un OK**
- **Reutilizado de Dame un OK:** Sistema de auth completo
- **Nuevo:** Feed de música y player básico
- **Feedback:** "Auth muy corporativo, necesita ser más cool"
- **Adaptación:** Misma lógica, nuevo styling para target joven

**Sprint 2: Features musicales únicas**  
- **Desarrollado from scratch:** Algoritmo de recomendación
- **Referencias:** Conocimiento del equipo Spotify/Pandora
- **Feedback:** "Recomendaciones muy predecibles"
- **Pivote:** Añadir factor de serendipity del 20%

## ⚠️ Errores Comunes en Desarrollo

### ❌ NO hacer:
- Desarrollar por semanas sin mostrar a Ángel
- Ignorar feedback "menor" (todo feedback importa)
- No documentar las razones detrás de decisiones técnicas  
- Subir código a repos antes de aprobación de Ángel
- Optimizar prematuramente antes de que funcione lo básico

### ✅ SÍ hacer:
- Demos cortas pero frecuentes (máximo cada 5 días)
- Documentar TODO el feedback palabra por palabra
- Preguntar cuando no esté claro qué quiere Ángel
- Mantener backup local de TODO antes de cambios grandes
- Consultar a los expertos virtuales ante dudas técnicas

## 🎯 Output de Fase de Desarrollo

Al finalizar esta fase, tendremos:

### 📁 Código y estructura completa  
```
development/
├── code/ - Código completo y funcional ✅
├── tests/ - Suite de testing completa ✅
├── docs/ - Documentación técnica actualizada ✅
├── iterations/ - Historial completo de sprints ✅
└── demos/ - Videos/capturas de cada demo ✅
```

### 📋 Documentación de proceso
- ✅ Todos los sprints documentados con feedback
- ✅ Todas las decisiones técnicas justificadas  
- ✅ Todo el feedback de Ángel capturado y procesado
- ✅ Roadmap actualizado según evolución del proyecto
- ✅ Quality gates implementados y funcionando

### 🚀 Estado del proyecto
**MVP COMPLETADO Y APROBADO POR ÁNGEL**
**LISTO PARA FASE 5: CIERRE DE VERSIÓN**

---

🎯 **SIGUIENTE PASO:** Una vez MVP aprobado por Ángel → `05-CIERRE-VERSION.md`