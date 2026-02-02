# 02-CREACION-EQUIPO.md — Fase 2: Creación del Equipo Inicial de Expertos Virtuales

## 🎯 ¿Qué es la Creación de Equipo?

La parte **MÁS CRÍTICA** del protocolo. Aquí convertimos un proyecto en solitario en un equipo de superexpertos mundiales trabajando virtualmente para nosotros.

**Filosofía Core:** Cada experto virtual se basa en investigación profunda de **10 referentes REALES** del mundo en su campo. No inventamos. Investigamos, absorbemos y fusionamos.

## 🔥 Objetivos de Esta Fase

1. **Identificar campos de expertise** necesarios para el proyecto
2. **Investigar a fondo** los 10 mejores del mundo en cada campo
3. **Absorber conocimiento real** de personas, papers, código, filosofías
4. **Crear superexpertos virtuales** que fusionen lo mejor de los 10
5. **Documentar todo** en estructura organizada
6. **Preparar el equipo** para las reuniones iniciales

## 📋 Metodología Paso a Paso

### ✅ PASO 1: Identificación de Campos de Expertise

**Leo debe analizar el proyecto y detectar QUÉ TIPOS DE EXPERTO necesita.**

**Preguntas guía:**
```
1. ¿Qué disciplinas técnicas necesito? (programación, electrónica, etc.)
2. ¿Qué aspectos de negocio debo cubrir? (marketing, ventas, operaciones)
3. ¿Qué conocimientos de usuario necesito? (UX, psicología, accesibilidad)
4. ¿Hay aspectos regulatorios o legales? (privacidad, normativas, certificaciones)
5. ¿Qué conocimiento de industria específica necesito? (salud, música, etc.)
```

**Ejemplo Real - Dame un OK (App seguridad mayores):**

Campos identificados:
1. **Desarrollo móvil iOS/Android** (tecnología core)
2. **UX para mayores** (usabilidad específica)  
3. **Geolocalización y sensores** (feature principal)
4. **Telemedicina y salud digital** (dominio del problema)
5. **Privacidad en apps de salud** (regulatorio)
6. **Psicología del envejecimiento** (entender al usuario)
7. **Marketing a familias** (cómo llegar al target)

**Crear archivo:** `team/00-CAMPOS-EXPERTISE.md`

```markdown
# Campos de Expertise - [Proyecto]

## 🎯 Análisis del Proyecto
[Breve descripción del proyecto y sus complejidades]

## 👥 Expertos Necesarios

### 1. [Nombre del Campo]
- **Por qué es necesario:** [explicación]
- **Qué debe saber:** [conocimientos específicos]
- **Impacto en el proyecto:** [cómo afecta al éxito]

### 2. [Siguiente campo]
[Repetir estructura]

## 📊 Priorización
1. **Críticos (sin ellos no funciona):** [lista]
2. **Importantes (mejoran mucho):** [lista]  
3. **Nice to have (pueden esperar):** [lista]

## 🚀 Orden de Creación
[En qué orden vamos a crear a los expertos]
```

### ✅ PASO 2: Investigación Profunda por Campo (10 Referentes Reales)

**Para CADA campo identificado, Leo debe:**

#### 2.1 Buscar los 10 mejores del mundo

**Estrategia de búsqueda (combinar TODOS estos métodos):**

1. **Google Scholar** - Papers académicos recientes
   - `"[campo]" expert research 2023 2024`
   - `"[campo]" best practices methodology`
   
2. **LinkedIn + Twitter** - Profesionales activos  
   - Buscar por cargo + experiencia
   - Mirar quién habla de [campo] con autoridad
   
3. **GitHub** (si aplica) - Código real y contribuciones
   - Repositorios más estrellados en [tecnología]
   - Contribuidores principales a proyectos open source
   
4. **Conferencias y talks** - Speakers reconocidos
   - YouTube: "[campo] conference 2024"
   - Sitios de conferencias: speakers y abstracts
   
5. **Libros y publicaciones** - Autores referentes
   - Amazon: libros mejor valorados en [campo]
   - O'Reilly, Manning, etc. para tecnología
   
6. **Startups y empresas** - Líderes de equipos exitosos
   - Crunchbase: fundadores de startups exitosas en [área]
   - AngelList: qué expertise buscan las empresas
   
7. **Universidades** - Profesores e investigadores
   - Rankings universitarios en [campo]
   - Papers más citados y sus autores

**Criterios para seleccionar los 10:**
- **Experiencia comprobable** (años, proyectos exitosos)
- **Impacto real** (empresas creadas, productos lanzados, papers citados)
- **Conocimiento actual** (activos en 2023-2024, no obsoletos)  
- **Diversidad de enfoques** (diferentes escuelas de pensamiento)
- **Relevancia al proyecto** (no solo fama general, sino aplicable a nosotros)

#### 2.2 Absorción de Conocimiento

**Por cada uno de los 10 referentes, Leo debe:**

1. **Biografía profesional**
   - ¿Quién es? ¿Dónde trabaja/trabajó?
   - ¿Qué ha conseguido? ¿Qué ha creado?
   - ¿Por qué es considerado experto?

2. **Filosofía y metodología**
   - ¿Cómo aborda los problemas?
   - ¿Qué principios sigue?
   - ¿Qué metodologías usa?

3. **Conocimiento técnico específico**
   - ¿Qué herramientas domina?
   - ¿Qué técnicas específicas usa?
   - ¿Qué errores comunes evita?

4. **Aplicaciones prácticas**
   - Casos de éxito concretos
   - Problemas específicos que ha resuelto
   - Lecciones aprendidas

**Fuentes de información por referente:**
- 📄 **Papers/artículos** que ha escrito (guardar PDFs)
- 🎥 **Videos/conferencias** (transcripciones + timestamps clave)
- 💻 **Código público** (si aplica - análisis de patrones)
- 📱 **Productos que ha creado** (análisis de features/decisiones)
- 🐦 **Posts en Twitter/LinkedIn** (filosofía de trabajo)
- 📚 **Libros** (capítulos más relevantes)
- 🎙️ **Podcasts/entrevistas** (insights de proceso)

#### 2.3 Estructura de Carpetas por Experto

**Para cada campo, crear:**

```
team/experts/[nombre-campo]/
├── FUENTES.md                    # Los 10 referentes y qué aporta cada uno
├── investigacion/
│   ├── referente-01-[nombre].md  # Investigación completa de cada referente
│   ├── referente-02-[nombre].md
│   └── ...
├── conocimiento/
│   ├── informe-sintesis.md       # Fusión del conocimiento de todos
│   ├── metodologias.md           # Procesos y metodologías extraídas
│   ├── herramientas.md           # Stack técnico recomendado
│   └── casos-estudio.md          # Casos reales aplicables
├── assets/
│   ├── papers/                   # PDFs de papers importantes
│   ├── videos/                   # Transcripciones de charlas clave
│   └── codigo/                   # Ejemplos de código (si aplica)
└── SUPEREXPERTO.md               # El experto virtual final
```

### ✅ PASO 3: Creación del Superexperto Virtual

**Para cada campo, crear archivo:** `team/experts/[campo]/SUPEREXPERTO.md`

```markdown
# Superexperto en [Campo] - [Nombre que le pongas]

## 👤 Perfil del Experto Virtual

### Identidad
- **Nombre:** [Ej: Dr. Mónica Torres - Experta en UX para Mayores]
- **Especialización:** [Campo específico]
- **Años de experiencia:** [Promedio de los 10 referentes]
- **Enfoque principal:** [Filosofía dominante extraída]

### Fusión de Conocimientos
Este experto virtual fusiona el conocimiento y experiencia de:
1. [Referente 1] - [Qué aporta especialmente]
2. [Referente 2] - [Su contribución clave]
[Lista completa de los 10]

## 🧠 Conocimiento Core

### Metodologías que domina
- **[Metodología 1]:** [Descripción + cuándo usarla]
- **[Metodología 2]:** [Descripción + ventajas]
[Lista todas las metodologías extraídas]

### Herramientas que usa
- **[Herramienta 1]:** [Por qué la prefiere]
- **[Herramienta 2]:** [Casos de uso específicos]
[Stack técnico completo]

### Principios de trabajo
1. **[Principio 1]:** [Explicación]
2. **[Principio 2]:** [Por qué es importante]
[Filosofía de trabajo destilada]

## 💡 Aplicación al Proyecto [Nombre]

### Problemas que puede resolver
- **[Problema 1]:** [Cómo lo abordaría]
- **[Problema 2]:** [Metodología específica]

### Recomendaciones iniciales
1. **[Recomendación 1]:** [Justificación basada en experiencia]
2. **[Recomendación 2]:** [Referencias a casos similares]

### Riesgos que puede prevenir
- **[Riesgo 1]:** [Por qué lo identifica + cómo evitarlo]
- **[Riesgo 2]:** [Lecciones de casos previos]

## 🎯 Estilo de Comunicación
[Cómo "habla" este experto en reuniones - personalidad]
[Ej: "Directo y práctico, siempre con datos que respalden las decisiones"]

## 📚 Referencias Clave
[Top 5 recursos que recomendaría leer]

## 🔄 Última actualización
[Fecha] - Conocimiento actualizado hasta [período]
```

**Ejemplo Real - Dame un OK:**

**Superexperto "Dr. Elena Martín - UX para Mayores":**
- Fusiona conocimiento de: Don Norman (diseño intuitivo), Susan Weinschenk (psicología cognitiva), Jennifer Romano Bergstrom (usabilidad para mayores), etc.
- Metodologías: User testing con mayores, diseño de botones grandes, contrastes altos, navegación simplificada
- Herramientas: Figma con plugins de accesibilidad, UserTesting.com con panel 65+, análisis de contraste

### ✅ PASO 4: Documento Equipo Maestro

**Crear:** `team/EQUIPO-MAESTRO.md`

```markdown
# Equipo Maestro - [Proyecto]

## 📊 Resumen Ejecutivo
- **Total de expertos:** [Número]
- **Campos cubiertos:** [Lista]
- **Referentes investigados:** [Número total]
- **Tiempo de investigación:** [Días invertidos]

## 👥 Lista Completa del Equipo

### 1. [Nombre Experto 1] - [Campo]
- **Archivo:** `team/experts/[carpeta]/SUPEREXPERTO.md`
- **Especialización:** [Breve descripción]
- **Referentes base:** [Nombres clave]
- **Contribución principal:** [Qué aporta al proyecto]

### 2. [Siguiente experto]
[Repetir estructura]

## 🎯 Matriz de Cobertura

| Necesidad del Proyecto | Experto Responsable | Backup/Apoyo |
|------------------------|-------------------|---------------|
| [Necesidad 1] | [Experto] | [Experto apoyo] |
| [Necesidad 2] | [Experto] | [Experto apoyo] |

## 📈 Niveles de Expertise

### Tier 1 - Críticos para MVP
- [Lista expertos esenciales]

### Tier 2 - Importantes para calidad  
- [Lista expertos importantes]

### Tier 3 - Optimización y escalado
- [Lista expertos nice-to-have]

## 🔄 Estado de Preparación
- ✅ [Experto listo]
- ✅ [Experto listo]
- ⏳ [Experto en investigación]
- ❌ [Experto pendiente]

## 🚀 Listo para Reuniones
**Criterio:** Todos los Tier 1 deben estar ✅

**Estado actual:** [LISTO/NO LISTO]
**Próximo paso:** [Fase 3: Reuniones Iniciales]
```

## 🎯 Casos Reales de Equipos Creados

### 🛡️ Dame un OK - Equipo Inicial (15 expertos)

**Campos investigados:**
1. **Desarrollo iOS nativo** (10 referentes: principales devs de apps de salud)
2. **Desarrollo Android nativo** (10 referentes: Google engineers + indie devs)
3. **UX para mayores** (10 referentes: especialistas en accesibilidad + gerontólogos)
4. **Geolocalización móvil** (10 referentes: expertos en GPS + indoor positioning)
5. **Arquitectura backend salud** (10 referentes: CTOs de healthtech + HIPAA experts)
6. **Privacidad y seguridad** (10 referentes: security researchers + legal tech)
7. **Telemedicina** (10 referentes: médicos tech + founders de telehealth)

**Resultado:** 15 superexpertos + 8 especialistas adicionales en IA dashboard

### 🎵 WhatsSound - Equipo Inicial (7 expertos)

**Campos investigados:**
1. **React Native** (10 referentes: core contributors + app builders)
2. **Audio processing móvil** (10 referentes: Spotify engineers + audio DSP experts)
3. **Social media architecture** (10 referentes: ex-Twitter, ex-Instagram engineers)
4. **Music recommendation algorithms** (10 referentes: Pandora/Spotify data scientists)
5. **Community management** (10 referentes: Discord/Reddit community leads)
6. **Audio streaming** (10 referentes: Twitch/Clubhouse audio engineers)
7. **Music rights y legal** (10 referentes: music industry lawyers + startup founders)

**Ampliación posterior a 17:** Se usó proyecto Dame un OK como referencia cruzada para añadir expertos en áreas compartidas (auth, deployment, analytics, etc.)

## ⚠️ Errores Comunes en Creación de Equipo

### ❌ NO hacer:
- Crear expertos "inventados" sin investigación real
- Conformarse con menos de 10 referentes por campo
- Copiar conocimiento superficial (solo biografías)
- Crear demasiados expertos (>20 en equipo inicial)
- No documentar las fuentes originales
- Saltearse campos "obvios" (todos son importantes)

### ✅ SÍ hacer:
- Investigar obsesivamente cada referente
- Guardar TODOS los materiales encontrados
- Crear personalidades distintivas para cada experto
- Validar que no hay overlaps ni gaps
- Mantener conocimiento actualizado (2023-2024)
- Documentar el proceso de investigación

## 🎯 Output de Creación de Equipo

Al finalizar esta fase, tendremos:

### 📁 Estructura completa
```
team/
├── 00-CAMPOS-EXPERTISE.md ✅
├── EQUIPO-MAESTRO.md ✅
└── experts/
    ├── [campo-1]/
    │   ├── FUENTES.md ✅
    │   ├── SUPEREXPERTO.md ✅
    │   ├── investigacion/ ✅
    │   ├── conocimiento/ ✅
    │   └── assets/ ✅
    └── [campo-n]/...
```

### 📋 Documentos clave
- ✅ Todos los campos de expertise identificados
- ✅ 10 referentes reales investigados por campo
- ✅ Superexpertos virtuales creados y documentados
- ✅ Equipo maestro organizado y priorizado
- ✅ Knowledge base completa por área

### 🚀 Estado del proyecto
**LISTO PARA FASE 3: REUNIONES INICIALES**

---

🎯 **SIGUIENTE PASO:** Una vez equipo creado y documentado → `03-REUNIONES-INICIALES.md`