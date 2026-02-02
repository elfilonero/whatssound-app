# 06-AMPLIACION-EQUIPO.md — Fase 6: Ampliación del Equipo Virtual

## 🎯 ¿Qué es la Ampliación de Equipo?

La ampliación ocurre cuando un proyecto **crece más allá de su alcance inicial** y necesita expertise adicional que el equipo actual no cubre. También ocurre cuando identificamos áreas de conocimiento que subestimamos en la Fase 2.

**Filosofía Core:** Ampliar no es "añadir gente". Es identificar carencias reales, investigar referentes reales y crear superexpertos que se integren orgánicamente con el equipo existente.

**⚡ REGLA FUNDAMENTAL:** La ampliación sigue EXACTAMENTE el mismo rigor de investigación que la Fase 2 (10 referentes reales por campo). No hay atajos. La única diferencia es que ahora tenemos contexto previo y podemos usar referencia cruzada entre proyectos.

## 🔥 Cuándo Ampliar el Equipo

### Señales de que Necesitas Ampliar

#### 🚨 Señales Urgentes (Actuar Inmediatamente)
1. **Bloqueo técnico:** El equipo actual no puede resolver un problema porque nadie tiene el expertise
2. **Cambio de scope por Ángel:** El director amplía la visión y aparecen necesidades nuevas
3. **Descubrimiento técnico:** Durante el desarrollo se revela que una tecnología requiere expertise específico
4. **Requisito regulatorio:** Aparece una necesidad legal/normativa que nadie cubre

#### ⚠️ Señales de Oportunidad (Planificar en 1-2 días)
1. **Calidad insuficiente:** Las soluciones actuales funcionan pero podrían ser mucho mejores con expertise dedicado
2. **Escalado inminente:** El proyecto va a crecer y las soluciones actuales no escalarán
3. **Nuevo mercado/vertical:** Ángel quiere llevar el producto a un nuevo segmento
4. **Integración compleja:** Necesitas conectar con sistemas externos que requieren conocimiento especializado

#### 💡 Señales Preventivas (Evaluar en próxima reunión)
1. **Un experto cubre demasiados campos:** Si un superexperto está respondiendo preguntas fuera de su área
2. **Gaps en reuniones:** Temas donde nadie en el equipo puede opinar con autoridad
3. **Decisiones sin fundamento:** Se toman decisiones técnicas "a ojo" en algún área
4. **Proyecto hermano necesita lo mismo:** Otro proyecto de Vertex necesita expertise similar

**Template de Detección:** `team/ampliacion/00-DETECCION-NECESIDAD.md`

```markdown
# Detección de Necesidad de Ampliación - [Proyecto]

## 📅 Fecha de Detección
[YYYY-MM-DD]

## 🚨 Tipo de Señal
[Urgente / Oportunidad / Preventiva]

## 💡 Contexto
[Qué estaba pasando cuando se detectó la necesidad]

## 🎯 Campo de Expertise Faltante
[Qué tipo de conocimiento nos falta]

## 📊 Impacto de NO Ampliar
- **En timeline:** [Cómo afecta al calendario]
- **En calidad:** [Cómo afecta al producto]
- **En riesgo:** [Qué riesgos introduce]

## ✅ Decisión
[Ampliar / Posponer / Descartar]
[Justificación]

## 👑 Aprobación de Ángel
[Pendiente / Aprobado / Rechazado]
```

## 📋 Proceso de Ampliación Paso a Paso

### ✅ PASO 1: Análisis de Carencias vs Equipo Actual

**Antes de investigar nada, Leo debe mapear qué tiene y qué le falta.**

**Crear:** `team/ampliacion/01-ANALISIS-CARENCIAS.md`

```markdown
# Análisis de Carencias - [Proyecto]

## 📊 Equipo Actual

### Expertos existentes y sus campos
| Experto | Campo Principal | Campos Secundarios | Carga Actual |
|---------|----------------|-------------------|--------------|
| [Nombre] | [Campo] | [Otros campos que cubre] | [Alta/Media/Baja] |

### Cobertura actual del proyecto
| Área del Proyecto | Cubierta por | Nivel de Cobertura |
|-------------------|-------------|-------------------|
| [Área 1] | [Experto(s)] | ✅ Completa / ⚠️ Parcial / ❌ Sin cobertura |

## 🕳️ Gaps Identificados

### Gap 1: [Nombre del gap]
- **Descripción:** [Qué conocimiento falta]
- **Impacto:** [Cómo afecta al proyecto]
- **Urgencia:** [Alta/Media/Baja]
- **¿Se puede resolver con equipo actual?** [Sí, parcialmente / No]

### Gap 2: [Siguiente gap]
[Repetir estructura]

## 🎯 Nuevos Campos de Expertise Necesarios

### Campo Nuevo 1: [Nombre]
- **Justificación:** [Por qué es necesario]
- **Qué debe cubrir:** [Conocimientos específicos]
- **Relación con equipo actual:** [Con qué expertos interactúa]

## 📈 Priorización de Ampliación
1. **Inmediato:** [Campos que bloquean]
2. **Esta semana:** [Campos que mejoran calidad]
3. **Próxima iteración:** [Campos nice-to-have]
```

**Ejemplo Real - WhatsSound (Ampliación de 7 a 17):**

Gaps detectados tras MVP:
1. **❌ Monetización y modelo freemium** — Nadie cubría cómo convertir usuarios gratuitos en premium
2. **❌ Audio fingerprinting** — Reconocimiento de canciones requería expertise muy específico
3. **⚠️ Push notifications y engagement** — El experto en social media lo cubría parcialmente pero no era su fuerte
4. **⚠️ Analytics y métricas** — Datos básicos sí, pero no tenían experto en product analytics
5. **❌ Moderación de contenido** — Con comunidad creciente, necesitaban políticas y herramientas

### ✅ PASO 2: Verificación de Referencia Cruzada

**ANTES de investigar desde cero, Leo debe verificar si otro proyecto de Vertex ya tiene expertos en ese campo.**

**⚡ ESTO ES CLAVE:** Si Dame un OK ya investigó 10 referentes en "Arquitectura Backend", WhatsSound puede REUTILIZAR ese superexperto como base y solo ajustar lo específico del nuevo proyecto.

**Proceso de referencia cruzada:**

```markdown
# Referencia Cruzada - [Campo Necesario]

## 🔍 Búsqueda en Proyectos Existentes

### Proyecto: Dame un OK
- **¿Tiene experto en [campo]?** [Sí/No]
- **Archivo:** [Ruta al SUPEREXPERTO.md]
- **Nivel de cobertura:** [Total/Parcial/Tangencial]
- **¿Es reutilizable?** [Sí/Con ajustes/No]
- **Ajustes necesarios:** [Qué cambiar para el nuevo proyecto]

### Proyecto: WhatsSound
- [Repetir análisis]

### Proyecto: [Otro]
- [Repetir análisis]

## 📋 Decisión

### Opción A: Reutilizar experto existente
- **Base:** [Superexperto de qué proyecto]
- **Ajustes:** [Qué conocimiento específico añadir]
- **Referentes adicionales a investigar:** [0-5, no necesariamente 10]

### Opción B: Crear desde cero
- **Justificación:** [Por qué no sirve ninguno existente]
- **Referentes a investigar:** 10 (proceso completo Fase 2)

### Opción C: Fusión de varios
- **Base 1:** [Experto de proyecto X]
- **Base 2:** [Experto de proyecto Y]
- **Complemento:** [Investigación adicional necesaria]
```

**Ejemplo Real - WhatsSound necesita "Arquitectura Backend":**

```
Búsqueda en proyectos existentes:
- Dame un OK tiene "Dr. Ricardo Vargas - Arquitectura Backend Salud"
  - Investigó: Martin Fowler, Sam Newman, Kelsey Hightower...
  - Cobertura: 70% aplicable (microservicios, APIs, bases de datos)
  - Ajustes: Quitar enfoque salud/HIPAA, añadir real-time audio streaming
  - Referentes adicionales: 3-4 específicos de audio streaming backends

DECISIÓN: Opción A - Reutilizar con ajustes
→ Ahorro de investigación: ~60%
→ Solo investigar 4 referentes adicionales en audio backend
```

### ✅ PASO 3: Investigación de Nuevos Referentes

**Si se decide crear desde cero → Proceso IDÉNTICO a Fase 2 (10 referentes)**
**Si se reutiliza → Investigar solo referentes complementarios (3-5)**
**Si es fusión → Investigar referentes que llenen los gaps entre las bases (3-7)**

#### 3.1 Para Campos Completamente Nuevos

Seguir EXACTAMENTE el proceso de `02-CREACION-EQUIPO.md`, Paso 2:
- Buscar 10 referentes reales usando todas las fuentes
- Absorber conocimiento profundo de cada uno
- Crear estructura de carpetas por experto
- Documentar FUENTES.md con los 10 referentes

**La única diferencia:** Ahora tenemos contexto del proyecto, así que la búsqueda es más enfocada.

```bash
# Estructura para nuevos expertos (ampliación)
team/experts-v2/[nombre-campo]/
├── FUENTES.md
├── investigacion/
│   ├── referente-01-[nombre].md
│   └── ...
├── conocimiento/
│   ├── informe-sintesis.md
│   ├── metodologias.md
│   ├── herramientas.md
│   └── casos-estudio.md
├── assets/
└── SUPEREXPERTO.md
```

**Nota:** Usamos `experts-v2/` para diferenciar del equipo original. Esto permite auditar qué se creó en qué fase.

#### 3.2 Para Campos Reutilizados de Otro Proyecto

```bash
# Estructura para expertos reutilizados
team/experts-v2/[nombre-campo]/
├── ORIGEN.md                     # De dónde viene + justificación
├── FUENTES-ADICIONALES.md        # Solo referentes nuevos (3-5)
├── investigacion-adicional/
│   ├── referente-extra-01.md
│   └── ...
├── ajustes/
│   ├── contexto-nuevo-proyecto.md
│   └── diferencias-clave.md
└── SUPEREXPERTO.md               # Versión adaptada al nuevo proyecto
```

**Template de ORIGEN.md:**

```markdown
# Origen del Experto - [Nombre]

## 🔗 Referencia Cruzada
- **Proyecto origen:** [Nombre del proyecto]
- **Experto base:** [Nombre del superexperto original]
- **Archivo base:** [Ruta completa]
- **Referentes originales (10):** [Lista completa]

## 🔧 Ajustes Realizados
- **Eliminado:** [Qué conocimiento no aplica al nuevo proyecto]
- **Añadido:** [Qué conocimiento nuevo se incorporó]
- **Modificado:** [Qué se reenfocó]

## 📚 Referentes Adicionales Investigados
1. [Referente extra 1] - [Qué aporta]
2. [Referente extra 2] - [Qué aporta]

## 💡 Ventaja de la Reutilización
[Qué ahorramos y qué ganamos por tener esta base]
```

### ✅ PASO 4: Creación de Superexpertos Ampliados

**Mismo formato que Fase 2, pero con sección adicional de integración.**

```markdown
# Superexperto en [Campo] - [Nombre] (AMPLIACIÓN)

## 👤 Perfil del Experto Virtual
[Mismo formato que Fase 2]

## 🧠 Conocimiento Core
[Mismo formato que Fase 2]

## 🤝 INTEGRACIÓN CON EQUIPO EXISTENTE (SECCIÓN NUEVA)

### Relaciones con expertos actuales
| Experto Existente | Tipo de Relación | Áreas de Colaboración |
|-------------------|-----------------|----------------------|
| [Nombre] | [Complementaria/Overlap/Dependencia] | [Temas específicos] |

### Conocimiento que COMPLEMENTA
- **A [Experto X]:** Le aporta [qué conocimiento]
- **A [Experto Y]:** Cubre lo que [Experto Y] no domina en [área]

### Conocimiento que DEPENDE DE
- **De [Experto X]:** Necesita input de [qué] para [qué decisión]
- **De [Experto Y]:** Requiere specs de [qué] antes de empezar

### Posibles CONFLICTOS
- **Con [Experto X]:** Pueden diferir en [tema]. Criterio de resolución: [quién tiene prioridad y por qué]

## 🔗 REFERENCIA CRUZADA (si aplica)
- **Origen:** [Proyecto y experto base]
- **Adaptaciones:** [Resumen de cambios]

## 💡 Aplicación al Proyecto [Nombre]
[Mismo formato que Fase 2]
```

### ✅ PASO 5: Actualización del Equipo Maestro

**Actualizar:** `team/EQUIPO-MAESTRO.md`

Añadir nueva sección:

```markdown
## 📈 AMPLIACIÓN v2 - [Fecha]

### Motivo de Ampliación
[Por qué se amplió el equipo]

### Nuevos Expertos Añadidos

#### [Número]. [Nombre Experto] - [Campo] (NUEVO)
- **Archivo:** `team/experts-v2/[carpeta]/SUPEREXPERTO.md`
- **Origen:** [Desde cero / Referencia cruzada de [proyecto]]
- **Referentes investigados:** [Número]
- **Integración con:** [Lista de expertos con los que interactúa]

### Equipo Completo Post-Ampliación
- **Total expertos:** [Nuevo total]
- **Expertos originales (Fase 2):** [Número]
- **Expertos ampliación (Fase 6):** [Número]
- **Expertos reutilizados:** [Número]

### Matriz de Cobertura Actualizada
[Actualizar la tabla de cobertura del equipo maestro original]
```

### ✅ PASO 6: Validación con Ángel

**Leo debe presentar a Ángel:**

1. **Análisis de carencias** — Por qué necesitamos ampliar
2. **Referencia cruzada** — Qué reutilizamos y qué es nuevo
3. **Nuevos superexpertos** — Perfil de cada nuevo experto
4. **Integración** — Cómo encajan con el equipo existente
5. **Equipo maestro actualizado** — Visión completa del equipo ampliado

**Preguntas de validación:**
```
"¿Estás de acuerdo con los nuevos campos de expertise identificados?"
"¿Te parece bien reutilizar [experto] de [proyecto]?"
"¿Falta algún campo que creas necesario?"
"¿Puedo proceder a las reuniones con el equipo ampliado?"
```

**⚡ CRITERIO DE APROBACIÓN:** Ángel dice explícitamente "OK, equipo ampliado aprobado" o equivalente.

## 🔄 Referencia Cruzada entre Proyectos — Guía Completa

### Filosofía

Cada proyecto de Vertex Developer es un **activo de conocimiento**. Los superexpertos no mueren cuando un proyecto termina: su conocimiento investigado es reutilizable.

### Base de Datos de Expertos Vertex

**Crear y mantener:** `~/clawd/vertex-knowledge-base/EXPERTOS-GLOBALES.md`

```markdown
# Base de Expertos Virtuales - Vertex Developer

## 📊 Estadísticas Globales
- **Total referentes investigados:** [Número]
- **Total superexpertos creados:** [Número]
- **Proyectos con equipos:** [Lista]

## 🔍 Índice por Campo

### Desarrollo Móvil
- **Dame un OK:** Dr. [Nombre] - iOS nativo (10 referentes)
- **Dame un OK:** Dr. [Nombre] - Android nativo (10 referentes)
- **WhatsSound:** [Nombre] - React Native (10 referentes)

### Backend / Arquitectura
- **Dame un OK:** Dr. Ricardo Vargas - Backend Salud (10 referentes)
- **WhatsSound:** [Nombre] - Audio Backend (4 referentes extra + base de Dame un OK)

### UX / Diseño
- **Dame un OK:** Dra. Elena Martín - UX Mayores (10 referentes)
- **WhatsSound:** [Nombre] - UX Social/Música (10 referentes)

### Audio / Música
- **WhatsSound:** [Nombre] - Audio Processing (10 referentes)
- **WhatsSound:** [Nombre] - Music Recommendation (10 referentes)

### Legal / Regulatorio
- **Dame un OK:** [Nombre] - Privacidad en Salud (10 referentes)
- **WhatsSound:** [Nombre] - Music Rights (10 referentes)

[Continuar con todos los campos]

## 🔗 Matriz de Reutilización

| Campo | Proyecto A → Proyecto B | Ahorro Estimado |
|-------|------------------------|-----------------|
| Backend | Dame un OK → WhatsSound | 60% (7 de 10 referentes aplican) |
| Auth/Security | Dame un OK → WhatsSound | 80% (casi idéntico) |
| Analytics | Dame un OK → WhatsSound | 50% (diferentes métricas) |
| UX | Dame un OK → WhatsSound | 20% (públicos muy diferentes) |
```

### Proceso de Reutilización

**Niveles de reutilización:**

1. **Reutilización Total (80-100%):** El campo es casi idéntico entre proyectos
   - Ejemplo: Authentication, deployment, CI/CD
   - Proceso: Copiar superexperto, ajustar 2-3 puntos específicos
   - Referentes adicionales: 0-2

2. **Reutilización Alta (50-80%):** El campo aplica pero el contexto cambia
   - Ejemplo: Backend (de salud a audio), Analytics (de familias a millennials)
   - Proceso: Usar como base, investigar 3-5 referentes adicionales
   - Ajustes: Reescribir sección de aplicación al proyecto

3. **Reutilización Parcial (20-50%):** Solo algunos conceptos son transferibles
   - Ejemplo: UX (de mayores a jóvenes), Legal (de salud a música)
   - Proceso: Extraer conceptos genéricos, investigar 7-8 referentes nuevos
   - Ajustes: Prácticamente un experto nuevo con algo de base

4. **Sin Reutilización (<20%):** El campo es completamente diferente
   - Ejemplo: Audio fingerprinting no tiene equivalente en Dame un OK
   - Proceso: Fase 2 completa desde cero (10 referentes)

### Ejemplo Real Completo: WhatsSound Reutilizando de Dame un OK

```
📊 ANÁLISIS DE REFERENCIA CRUZADA
Proyecto origen: Dame un OK (15 expertos + 8 IA)
Proyecto destino: WhatsSound (necesita ampliar de 7 a 17)

CAMPOS A AMPLIAR (10 nuevos expertos):

1. Monetización Freemium → NUEVO (desde cero, 10 referentes)
   - No hay equivalente en Dame un OK

2. Audio Fingerprinting → NUEVO (desde cero, 10 referentes)
   - Campo completamente específico de WhatsSound

3. Push Notifications → REUTILIZACIÓN ALTA de Dame un OK
   - Base: Experto engagement de Dame un OK
   - Referentes adicionales: 4 (específicos de apps sociales)
   - Ahorro: ~60%

4. Product Analytics → REUTILIZACIÓN PARCIAL de Dame un OK
   - Base: Métricas de Dame un OK (conceptos genéricos)
   - Referentes adicionales: 7 (analytics para social media)
   - Ahorro: ~30%

5. Moderación de Contenido → NUEVO (desde cero, 10 referentes)
   - Dame un OK no tiene contenido generado por usuarios

6. Auth/Security → REUTILIZACIÓN TOTAL de Dame un OK
   - Base: Experto seguridad de Dame un OK
   - Referentes adicionales: 1 (OAuth social login específico)
   - Ahorro: ~90%

7. Deployment/DevOps → REUTILIZACIÓN TOTAL de Dame un OK
   - Base: Experto infra de Dame un OK
   - Ajustes: Solo cambiar de Vercel a Expo EAS
   - Ahorro: ~85%

8. Real-time Communication → REUTILIZACIÓN PARCIAL
   - Base: WebSockets de Dame un OK (notificaciones)
   - Referentes adicionales: 6 (audio streaming real-time)
   - Ahorro: ~40%

9. Growth Hacking Social → NUEVO (desde cero, 10 referentes)
   - No hay equivalente en Dame un OK

10. Music Industry Partnerships → NUEVO (desde cero, 10 referentes)
    - Específico del dominio musical

RESUMEN:
- Desde cero (10 ref cada uno): 4 campos = 40 referentes
- Reutilización total (0-2 ref extra): 2 campos = 3 referentes
- Reutilización alta (3-5 ref extra): 1 campo = 4 referentes
- Reutilización parcial (6-8 ref extra): 2 campos = 13 referentes
- Nuevo pero con base parcial: 1 campo = 7 referentes

TOTAL REFERENTES A INVESTIGAR: 67
SIN REUTILIZACIÓN SERÍAN: 100
AHORRO: 33%
```

## 📁 Estructura de Carpetas Post-Ampliación

```
team/
├── 00-CAMPOS-EXPERTISE.md          # Original (Fase 2)
├── EQUIPO-MAESTRO.md               # Actualizado con ampliación
├── experts/                         # Equipo original (Fase 2)
│   ├── [campo-1]/
│   │   ├── SUPEREXPERTO.md
│   │   └── ...
│   └── [campo-n]/
├── experts-v2/                      # Equipo ampliado (Fase 6)
│   ├── [campo-nuevo-1]/
│   │   ├── SUPEREXPERTO.md
│   │   ├── ORIGEN.md               # Si es reutilizado
│   │   └── ...
│   └── [campo-nuevo-n]/
├── ampliacion/
│   ├── 00-DETECCION-NECESIDAD.md
│   ├── 01-ANALISIS-CARENCIAS.md
│   ├── 02-REFERENCIA-CRUZADA.md
│   └── 03-PLAN-AMPLIACION.md
└── cross-project/
    └── EXPERTOS-REUTILIZADOS.md     # Log de reutilizaciones
```

## ⚠️ Errores Comunes en Ampliación

### ❌ NO hacer:
- **Ampliar sin necesidad real** — No crear expertos "por si acaso"
- **Saltarse la investigación** — Aunque sea reutilizado, debe haber rigor
- **Ignorar la integración** — Un experto nuevo sin relaciones con el equipo es inútil
- **No actualizar el Equipo Maestro** — El documento central SIEMPRE debe reflejar el estado real
- **Reutilizar sin adaptar** — Copiar un experto de otro proyecto sin ajustar contexto
- **Crear expertos duplicados** — Verificar que no hay overlap con equipo existente
- **Ampliar demasiado de golpe** — Máximo 5-7 expertos nuevos por ampliación
- **No documentar el origen** — Si es referencia cruzada, SIEMPRE documentar de dónde viene

### ✅ SÍ hacer:
- **Detectar necesidades proactivamente** — No esperar a que algo falle
- **Buscar en proyectos existentes PRIMERO** — La referencia cruzada ahorra tiempo brutal
- **Documentar el proceso de decisión** — Por qué se amplía, por qué este campo, por qué estos referentes
- **Integrar con equipo existente** — Definir relaciones ANTES de las reuniones
- **Validar con Ángel** — Siempre presentar y esperar aprobación
- **Mantener la base global de expertos** — Es un activo de Vertex Developer
- **Etiquetar versiones del equipo** — v1 (original), v2 (primera ampliación), etc.

## 🎯 Output de Ampliación de Equipo

Al finalizar esta fase, tendremos:

### 📁 Estructura actualizada
```
team/
├── 00-CAMPOS-EXPERTISE.md ✅ (original)
├── EQUIPO-MAESTRO.md ✅ (actualizado)
├── experts/ ✅ (originales)
├── experts-v2/ ✅ (nuevos)
├── ampliacion/ ✅ (documentación del proceso)
└── cross-project/ ✅ (referencia cruzada)
```

### 📋 Documentos clave
- ✅ Análisis de carencias completado
- ✅ Referencia cruzada con proyectos existentes evaluada
- ✅ Nuevos superexpertos creados y documentados
- ✅ Integración con equipo existente definida
- ✅ Equipo maestro actualizado con nuevo total
- ✅ Base global de expertos Vertex actualizada

### 🚀 Estado del proyecto
**LISTO PARA FASE 7: REUNIONES AMPLIADAS**

---

🎯 **SIGUIENTE PASO:** Una vez equipo ampliado aprobado por Ángel → `07-REUNIONES-AMPLIADAS.md`
