# 07-REUNIONES-AMPLIADAS.md — Fase 7: Reuniones del Equipo Ampliado

## 🎯 ¿Qué son las Reuniones Ampliadas?

Son las reuniones que ocurren después de ampliar el equipo (Fase 6). A diferencia de las reuniones iniciales (Fase 3), aquí **ya hay contexto previo, decisiones tomadas y trabajo avanzado**. El objetivo no es empezar de cero, sino integrar nuevos expertos en un equipo que ya funciona.

**Diferencia Fundamental con Fase 3:**
- En Fase 3: Todo es nuevo. Nadie sabe nada. Se explora.
- En Fase 7: Hay historia. Hay decisiones. Hay código. Se integra.

**⚡ REGLA FUNDAMENTAL:** Los nuevos expertos deben recibir TODO el contexto previo antes de opinar. No se permite que un experto nuevo contradiga decisiones previas sin justificación técnica sólida respaldada por sus referentes.

## 🔥 Tipos de Reuniones Ampliadas

### Tipo 1: 🎓 Onboarding de Nuevos Expertos
Integrar nuevos expertos con el contexto del proyecto.

### Tipo 2: 🤝 Reunión de Integración
Nuevos expertos + expertos existentes trabajando juntos por primera vez.

### Tipo 3: 🔗 Reunión Cross-Proyecto
Expertos compartidos entre proyectos sincronizando conocimiento.

### Tipo 4: 🎪 Plenaria Ampliada
Todo el equipo (original + nuevo) consolidando el roadmap actualizado.

## 📋 Proceso Completo

### ✅ PASO 1: Preparación del Paquete de Onboarding

**Antes de cualquier reunión, Leo debe preparar un paquete de contexto para cada nuevo experto.**

**Crear:** `meetings/expanded/00-ONBOARDING-PACK.md`

```markdown
# Paquete de Onboarding - [Proyecto]

## 📅 Fecha de Preparación
[YYYY-MM-DD]

## 🎯 Para Nuevos Expertos de Ampliación v[N]

### 📖 Documentos de Lectura Obligatoria (en este orden)
1. **Genesis del proyecto:** `docs/00-GENESIS.md`
2. **Alcance y objetivos:** `docs/specs/01-alcance-inicial.md`
3. **Equipo Maestro:** `team/EQUIPO-MAESTRO.md`
4. **Acta de reunión plenaria:** `meetings/initial/PLENARIA.md`
5. **Estado actual del desarrollo:** `development/progress/ESTADO-ACTUAL.md`

### 🎯 Resumen Ejecutivo para Nuevos Expertos
[Leo escribe un resumen de 1 página con:]
- Qué es el proyecto y para quién
- Qué se ha decidido hasta ahora
- Qué está construido y qué falta
- Por qué se amplió el equipo
- Qué se espera de los nuevos expertos

### 📊 Decisiones Previas que NO están en discusión
[Lista de decisiones cerradas que los nuevos expertos deben respetar]

| Decisión | Tomada por | Fecha | Justificación |
|----------|-----------|-------|---------------|
| Stack: React Native | Plenaria original | [Fecha] | [Razón] |
| Backend: Supabase | Experto Backend | [Fecha] | [Razón] |
| [Otra decisión] | [Quién] | [Fecha] | [Razón] |

### 🔓 Áreas ABIERTAS para Input de Nuevos Expertos
[Lista de temas donde los nuevos expertos SÍ deben opinar]
- [Tema 1] — [Por qué necesitamos su input]
- [Tema 2] — [Qué decisión hay que tomar]

### ❓ Preguntas Pendientes para Nuevos Expertos
[Preguntas específicas que el equipo actual tiene para los nuevos]
1. Para [Experto Monetización]: "¿Cuál es el modelo freemium óptimo para una app social de audio?"
2. Para [Experto Analytics]: "¿Qué métricas deberíamos trackear desde día 1?"
```

### ✅ PASO 2: Reuniones de Onboarding (Tipo 1)

**Una reunión individual por cada nuevo experto.**

**Duración:** 30-45 minutos por experto
**Participantes:** Leo + 1 nuevo experto + 1 experto existente relevante

**Estructura de la reunión:**

```markdown
# Onboarding - [Nombre Nuevo Experto]

## ⏱️ Agenda (45 min)

### Bloque 1: Contexto (15 min)
- Leo presenta el proyecto
- Leo presenta las decisiones previas
- Experto existente da contexto de su área

### Bloque 2: Absorción (15 min)
- Nuevo experto procesa la información
- Preguntas del nuevo experto al equipo
- Clarificación de expectativas

### Bloque 3: Primeras Impresiones (15 min)
- Nuevo experto da sus primeras observaciones
- ¿Ve algo que le preocupe?
- ¿Confirma que su expertise aplica al problema?
- ¿Qué necesita investigar antes de la reunión de integración?

## 📝 Acta

### Contexto Presentado
[Resumen de lo que se explicó]

### Preguntas del Nuevo Experto
1. [Pregunta] → [Respuesta]
2. [Pregunta] → [Respuesta]

### Primeras Observaciones
- [Observación 1]
- [Observación 2]

### Preocupaciones Identificadas
- [Preocupación 1] → [Plan de acción]

### Preparación para Reunión de Integración
- [Qué debe preparar el nuevo experto]
- [Qué debe investigar]
- [Con quién debe hablar antes]

### ✅ Estado
[ONBOARDING COMPLETADO / NECESITA MÁS CONTEXTO]
```

**Ejemplo Real - WhatsSound, Onboarding de Experto en Monetización:**

```
Reunión: Onboarding Experto Monetización Freemium
Participantes: Leo + Nuevo (Experto Monetización) + Existente (Experto Social Media)

Contexto presentado:
- WhatsSound es una red social de música con 7 expertos iniciales
- MVP funcional con: perfiles, feed de audio, likes, follows
- Sin monetización actual (todo gratis)
- Ángel quiere modelo freemium pero no sabe exactamente qué cobrar

Primeras observaciones del experto:
- "El engagement actual es la métrica más importante antes de monetizar"
- "Necesito datos de retención antes de proponer un modelo"
- "Sugiero no monetizar hasta 10K usuarios activos"
- "Modelo más probable: premium para creators (herramientas avanzadas)"

Preparación para integración:
- Investigar modelos freemium de SoundCloud, Bandcamp, Spotify for Artists
- Preparar 3 propuestas de modelo para la reunión de integración
- Hablar con Experto Analytics para definir métricas necesarias
```

### ✅ PASO 3: Reuniones de Integración (Tipo 2)

**Reuniones temáticas donde nuevos expertos trabajan con los existentes.**

**Se organizan por CLUSTERS de relación, no individualmente.**

**Leo debe identificar clusters:**

```markdown
# Clusters de Integración - [Proyecto]

## Cluster 1: [Nombre del Cluster]
- **Tema central:** [Qué van a discutir]
- **Expertos existentes:** [Lista]
- **Expertos nuevos:** [Lista]
- **Output esperado:** [Qué decisiones deben tomar]

## Cluster 2: [Siguiente]
[Repetir]
```

**Ejemplo Real - WhatsSound, Clusters de Integración:**

```
Cluster 1: MONETIZACIÓN + PRODUCTO
- Existentes: Experto Social Media, Experto React Native
- Nuevos: Experto Monetización, Experto Product Analytics
- Tema: Definir modelo freemium + métricas + implementación técnica
- Output: Documento de modelo de negocio + specs técnicas de paywall

Cluster 2: CONTENIDO + COMUNIDAD
- Existentes: Experto Community Management, Experto Audio Processing
- Nuevos: Experto Moderación, Experto Audio Fingerprinting
- Tema: Políticas de moderación + detección automática de contenido
- Output: Políticas de comunidad + specs de sistema de moderación

Cluster 3: INFRAESTRUCTURA + ESCALA
- Existentes: Experto Backend, Experto Streaming
- Nuevos: Experto DevOps (reutilizado), Experto Real-time
- Tema: Preparar arquitectura para escalar de 1K a 100K usuarios
- Output: Arquitectura v2 + plan de migración
```

**Estructura de Reunión de Integración:**

```markdown
# Reunión de Integración - Cluster [Nombre]

## 📅 Fecha: [YYYY-MM-DD]
## ⏱️ Duración: 60-90 minutos

## 👥 Participantes
- **Facilitador:** Leo
- **Expertos existentes:** [Lista con campos]
- **Expertos nuevos:** [Lista con campos]

## 📋 Agenda

### Bloque 1: Sincronización (20 min)
- Estado actual del área que cubre este cluster
- Decisiones previas relevantes
- Problemas abiertos que motivaron la ampliación

### Bloque 2: Input de Nuevos Expertos (25 min)
- Cada nuevo experto presenta sus observaciones post-onboarding
- Propuestas concretas basadas en sus referentes
- Recomendaciones para el equipo

### Bloque 3: Debate Integrado (20 min)
- Expertos existentes reaccionan a las propuestas
- Identificar conflictos o desacuerdos
- Buscar síntesis entre enfoques

### Bloque 4: Decisiones y Acción (15 min)
- Decisiones tomadas
- Tasks asignadas
- Dependencias identificadas
- Fecha de próximo checkpoint

## 📝 Acta

### Presentaciones de Nuevos Expertos
#### [Nombre Nuevo Experto 1]
- **Propuesta principal:** [Qué propone]
- **Justificación:** [Basada en qué referentes]
- **Impacto en trabajo existente:** [Qué cambia]

### Debate
- **Acuerdos:** [En qué coincidieron todos]
- **Desacuerdos:** [Puntos de fricción]
- **Resolución:** [Cómo se resolvieron - o si se escalan a Ángel]

### Decisiones Tomadas
| # | Decisión | Propuesta por | Aprobada por | Impacto |
|---|----------|--------------|-------------|---------|
| 1 | [Decisión] | [Quién] | [Consenso/Ángel] | [Alto/Medio/Bajo] |

### Tasks Asignadas
| Task | Responsable | Deadline | Dependencias |
|------|------------|----------|--------------|
| [Task] | [Experto] | [Fecha] | [De qué depende] |

### Alertas para Ángel
[Cosas que requieren la atención o decisión del director]
- [Alerta 1]: [Descripción + opciones]
```

### ✅ PASO 4: Reuniones Cross-Proyecto (Tipo 3)

**Ocurren cuando hay expertos reutilizados de otro proyecto.**

**Propósito:** Sincronizar conocimiento entre los dos proyectos para que las decisiones de uno no contradigan al otro.

```markdown
# Reunión Cross-Proyecto

## 📅 Fecha: [YYYY-MM-DD]

## 🔗 Proyectos Involucrados
- **Proyecto A:** [Nombre] (contexto original del experto)
- **Proyecto B:** [Nombre] (proyecto que reutiliza)

## 👥 Participantes
- **Leo** (facilitador)
- **Experto compartido:** [Nombre] - presente en ambos proyectos
- **Experto Proyecto A:** [Nombre] - contexto original
- **Experto Proyecto B:** [Nombre] - contexto nuevo

## 📋 Agenda

### 1. Estado en Proyecto A (10 min)
- Decisiones vigentes en [campo] para Proyecto A
- Lecciones aprendidas
- Problemas resueltos que podrían repetirse en B

### 2. Adaptación para Proyecto B (15 min)
- Qué del conocimiento de A aplica directamente
- Qué necesita adaptación
- Qué NO aplica en absoluto

### 3. Sincronización de Conocimiento (15 min)
- ¿Hay descubrimientos en B que benefician a A?
- ¿Hay conflictos entre las decisiones de ambos proyectos?
- ¿El experto compartido mantiene coherencia?

### 4. Acuerdos (10 min)
- Decisiones de sincronización
- Calendario de futuras sincronizaciones
- Proceso para comunicar cambios entre proyectos

## 📝 Acta

### Conocimiento Transferido A → B
- [Lección 1 de A que aplica en B]
- [Solución 1 de A que se reutiliza en B]

### Conocimiento Transferido B → A
- [Descubrimiento en B que beneficia a A]

### Conflictos Detectados
- [Conflicto] → [Resolución]

### Acuerdos de Sincronización
- Frecuencia de sync: [Cada cuánto]
- Canal de comunicación: [Cómo se comunican cambios]
- Responsable de coherencia: [Quién vigila que no diverjan]
```

**Ejemplo Real - Dame un OK ↔ WhatsSound:**

```
Reunión Cross-Proyecto: Auth/Security
Experto compartido: Experto Seguridad (originalmente Dame un OK)

Conocimiento A → B:
- Implementación OAuth con Supabase ya probada y estable
- Patrón de refresh tokens con TTL de 7 días funciona bien
- Row Level Security policies ya documentadas y testeadas
- Lección: no usar JWT custom, Supabase maneja todo mejor

Adaptación necesaria para B:
- Dame un OK usa auth por email/password (mayores)
- WhatsSound necesita social login (Google, Apple, Spotify)
- Mismo motor (Supabase Auth) pero diferentes providers
- Nuevo experto necesita investigar OAuth flow para cada provider

Conocimiento B → A:
- Social login de WhatsSound podría añadirse a Dame un OK v2
  (familiares jóvenes podrían preferir "Login con Google")

Acuerdo: El experto mantiene un doc compartido con patterns de auth
reutilizables entre ambos proyectos
```

### ✅ PASO 5: Plenaria Ampliada (Tipo 4)

**La reunión más importante. Todo el equipo junto.**

**Diferencias con la Plenaria Inicial (Fase 3):**

| Aspecto | Plenaria Inicial | Plenaria Ampliada |
|---------|-----------------|-------------------|
| **Contexto previo** | Ninguno | Ya hay decisiones, código, y progreso |
| **Objetivo** | Definir roadmap desde cero | Actualizar roadmap con nuevas capacidades |
| **Duración** | 2-3 horas | 1.5-2 horas (hay base) |
| **Conflictos** | Entre enfoques teóricos | Entre lo existente y lo propuesto |
| **Output** | Roadmap v1 | Roadmap v2 actualizado |
| **Tono** | Exploratorio | Ejecutivo |

**Estructura de Plenaria Ampliada:**

```markdown
# Plenaria Ampliada - [Proyecto]

## 📅 Fecha: [YYYY-MM-DD]
## ⏱️ Duración: 90-120 minutos

## 👥 Participantes
### Equipo Original (Fase 2)
1. [Nombre] - [Campo]
2. [Nombre] - [Campo]
[Lista completa]

### Equipo Ampliado (Fase 6)
1. [Nombre] - [Campo] (NUEVO / REUTILIZADO de [proyecto])
2. [Nombre] - [Campo] (NUEVO)
[Lista completa]

### Facilitador
Leo AI

### Director de Producto
Ángel Fernández (disponible para consultas)

## 📋 Agenda

### Bloque 1: Estado del Proyecto (15 min)
- Leo presenta estado actual completo
- Progreso vs roadmap original
- Motivos de la ampliación
- Presentación rápida de nuevos expertos

### Bloque 2: Reportes de Clusters (30 min)
- Cada cluster de integración presenta sus conclusiones
- Decisiones ya tomadas en reuniones de integración
- Decisiones que necesitan aprobación del equipo completo

### Bloque 3: Roadmap Actualizado (30 min)
- Revisar roadmap original
- Incorporar nuevas capacidades del equipo ampliado
- Reprioritizar features con nuevo expertise
- Definir nuevo timeline

### Bloque 4: Dependencias y Riesgos (15 min)
- Mapear dependencias entre equipos original y ampliado
- Identificar nuevos riesgos
- Plan de mitigación

### Bloque 5: Compromisos y Próximos Pasos (15 min)
- Cada experto confirma sus deliverables
- Timeline de próxima iteración
- Calendario de reuniones de seguimiento
- Temas para escalar a Ángel

## 📝 Acta de Plenaria Ampliada

### Resumen Ejecutivo
[3-5 líneas: qué se decidió en esta plenaria]

### Roadmap Actualizado v2
| Fase | Feature/Milestone | Responsable(s) | Deadline | Estado |
|------|------------------|----------------|----------|--------|
| [Fase] | [Feature] | [Experto(s)] | [Fecha] | [Nuevo/Existente/Modificado] |

### Nuevas Features Incorporadas (por ampliación)
1. **[Feature]** — Propuesta por [Nuevo Experto]
   - Justificación: [Por qué]
   - Impacto en roadmap: [Qué cambia]
   - Dependencias: [De qué depende]

### Decisiones Clave
| # | Decisión | Consenso | Notas |
|---|----------|---------|-------|
| 1 | [Decisión] | [Sí/No/Parcial] | [Detalles] |

### Riesgos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación | Responsable |
|--------|-------------|---------|------------|-------------|
| [Riesgo] | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Plan] | [Quién] |

### Para Ángel
[Decisiones que requieren aprobación del director]
1. [Decisión 1]: [Opciones A vs B]
2. [Decisión 2]: [Recomendación del equipo]
```

## 🔄 Sincronización de Conocimiento entre Equipos

### El Problema
Cuando amplías un equipo, los nuevos expertos no tienen el contexto acumulado. Y los existentes no saben qué aportan los nuevos. Hay que cerrar este gap.

### Mecanismo: Knowledge Sync Document

**Crear:** `meetings/expanded/KNOWLEDGE-SYNC.md`

```markdown
# Sincronización de Conocimiento - [Proyecto]

## 📊 Estado del Knowledge Graph

### Conocimiento del Equipo Original → Nuevos Expertos
| Tema | Documentado en | Transferido a | Estado |
|------|---------------|--------------|--------|
| [Decisión stack] | [Acta reunión X] | [Experto nuevo Y] | ✅/⏳/❌ |

### Conocimiento de Nuevos Expertos → Equipo Original
| Expertise Nuevo | Aportado por | Relevante para | Estado |
|----------------|-------------|----------------|--------|
| [Monetización freemium] | [Experto Monetización] | [Experto Backend, Experto Social] | ✅/⏳/❌ |

### Gaps de Conocimiento Pendientes
- [ ] [Experto X] necesita entender [tema Y] de [Experto Z]
- [ ] [Experto A] debe compartir [conocimiento B] con [Experto C]

### Calendario de Syncs
| Fecha | Participantes | Tema | Estado |
|-------|-------------|------|--------|
| [Fecha] | [Quiénes] | [Qué] | [Programada/Completada] |
```

### Reglas de Sincronización

1. **Todo nuevo experto lee TODO el contexto antes de opinar** — Sin excepciones
2. **Todo experto existente recibe un brief de las nuevas capacidades** — 1 página max
3. **Los conflictos se resuelven con datos, no con jerarquía** — El experto original no "gana" por antigüedad
4. **Las decisiones previas se respetan salvo justificación técnica** — "Los referentes X, Y, Z demuestran que..." es válido; "Yo creo que..." no
5. **Leo documenta TODA transferencia de conocimiento** — Si no está escrito, no pasó

## 📁 Estructura de Carpetas para Reuniones Ampliadas

```
meetings/
├── initial/                          # Fase 3 (ya completada)
│   ├── [campo-1]-reunion.md
│   └── PLENARIA.md
├── expanded/                         # Fase 7 (esta fase)
│   ├── 00-ONBOARDING-PACK.md
│   ├── onboarding/
│   │   ├── onboarding-[experto-1].md
│   │   ├── onboarding-[experto-2].md
│   │   └── ...
│   ├── integration/
│   │   ├── cluster-1-[nombre].md
│   │   ├── cluster-2-[nombre].md
│   │   └── ...
│   ├── cross-project/
│   │   ├── sync-[proyecto-a]-[proyecto-b]-[campo].md
│   │   └── ...
│   ├── PLENARIA-AMPLIADA.md
│   └── KNOWLEDGE-SYNC.md
└── decisions/
    ├── decision-log-v1.md            # Decisiones equipo original
    └── decision-log-v2.md            # Decisiones equipo ampliado
```

## ⚠️ Errores Comunes en Reuniones Ampliadas

### ❌ NO hacer:
- **Repetir las reuniones iniciales desde cero** — Ya hay contexto, úsalo
- **Dejar que nuevos expertos ignoren decisiones previas** — El onboarding es obligatorio
- **Mezclar todos los expertos nuevos en una sola reunión** — Usar clusters
- **Ignorar las reuniones cross-proyecto** — Si reutilizas expertos, la sincronización es crítica
- **No documentar el onboarding** — Cada nuevo experto debe tener acta de onboarding
- **Hacer la plenaria sin haber hecho las integraciones** — La plenaria consolida, no descubre
- **Dejar que la plenaria ampliada dure más de 2 horas** — Ya hay base, debe ser ejecutiva
- **No actualizar el Knowledge Sync** — Es un documento vivo, no estático

### ✅ SÍ hacer:
- **Preparar el paquete de onboarding ANTES de las reuniones** — Es el documento más importante
- **Incluir un experto existente en cada onboarding** — Puente entre lo viejo y lo nuevo
- **Usar clusters temáticos para las integraciones** — Más eficiente que reuniones 1-a-1
- **Documentar conflictos explícitamente** — Con quién, sobre qué, cómo se resolvió
- **Mantener a Ángel informado** — Resumen ejecutivo después de cada tipo de reunión
- **Actualizar el roadmap en la plenaria** — El roadmap v2 es el output principal
- **Verificar que no hay gaps post-plenaria** — Todos los campos deben tener responsable

## 🎯 Output de Reuniones Ampliadas

Al finalizar esta fase, tendremos:

### 📁 Estructura completa
```
meetings/expanded/ ✅
├── 00-ONBOARDING-PACK.md ✅
├── onboarding/ ✅ (1 acta por nuevo experto)
├── integration/ ✅ (1 acta por cluster)
├── cross-project/ ✅ (si aplica)
├── PLENARIA-AMPLIADA.md ✅
└── KNOWLEDGE-SYNC.md ✅
```

### 📋 Documentos clave
- ✅ Todos los nuevos expertos onboarded con contexto completo
- ✅ Clusters de integración completados con decisiones
- ✅ Reuniones cross-proyecto realizadas (si aplica)
- ✅ Plenaria ampliada con roadmap v2 aprobado
- ✅ Knowledge sync actualizado sin gaps
- ✅ Decision log v2 documentado

### 🚀 Estado del proyecto
**LISTO PARA FASE 8: PREPARACIÓN PARA EJECUCIÓN**

---

🎯 **SIGUIENTE PASO:** Una vez reuniones completadas y roadmap v2 aprobado → `08-PREPARACION-EJECUCION.md`
